package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.*
import no.vargstudios.bifrost.server.db.ElementCategoryDao
import no.vargstudios.bifrost.server.db.ElementDao
import no.vargstudios.bifrost.server.db.ElementFrameDao
import no.vargstudios.bifrost.server.db.ElementVersionDao
import no.vargstudios.bifrost.server.db.model.ElementCategoryRow
import no.vargstudios.bifrost.server.db.model.ElementFrameRow
import no.vargstudios.bifrost.server.db.model.ElementRow
import no.vargstudios.bifrost.server.db.model.ElementVersionRow
import no.vargstudios.bifrost.server.service.PathResolver
import no.vargstudios.bifrost.worker.api.model.ImageFormat.EXR
import no.vargstudios.bifrost.worker.api.model.ImageFormat.JPEG
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.nio.file.DirectoryNotEmptyException
import java.nio.file.Files
import java.nio.file.NoSuchFileException
import java.time.ZonedDateTime
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.MediaType.WILDCARD
import kotlin.math.max
import java.nio.file.Path as FilePath

@Path("/api/v1/elements")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class ElementApi(
    val elementDao: ElementDao,
    val elementVersionDao: ElementVersionDao,
    val elementCategoryDao: ElementCategoryDao,
    val elementFrameDao: ElementFrameDao,
    val pathResolver: PathResolver
) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    val originalName = "Original"
    val previewName = "Preview"
    val previewImageName = "preview.jpg"
    val previewVideoName = "preview.mp4"

    @GET
    fun listElements(): List<Element> {
        return elementDao.list()
            .map { element ->
                val versions = elementVersionDao.listForElement(element.id)
                val category = elementCategoryDao.get(element.categoryId)
                    ?: throw IllegalStateException("Element has non-existing category")
                mapElement(element, versions, category)
            }
    }

    @POST
    fun createElement(createElement: CreateElement): Element {
        val element = ElementRow(
            categoryId = createElement.categoryId,
            name = createElement.name,
            framecount = createElement.framecount,
            framerate = createElement.framerate,
            channels = createElement.channels,
            alpha = createElement.alpha
        )
        elementDao.insert(element)
        logger.info("Created element ${element.id}")

        // Required versions
        val versions = mutableListOf(
            ElementVersionRow(
                elementId = element.id,
                name = originalName,
                width = createElement.width,
                height = createElement.height,
                filetype = EXR.extension
            ),
            ElementVersionRow(
                elementId = element.id,
                name = previewName,
                width = 480 * createElement.width / max(createElement.width, createElement.height),
                height = 480 * createElement.height / max(createElement.width, createElement.height),
                filetype = JPEG.extension
            )
        )

        // Conditional versions
        listOf(8192, 4096, 2048, 1024)
            .filter { size -> size * 1.5 < max(createElement.width, createElement.height) }
            .map { size ->
                ElementVersionRow(
                    elementId = element.id,
                    name = "${size / 1024}K",
                    width = size * createElement.width / max(createElement.width, createElement.height),
                    height = size * createElement.height / max(createElement.width, createElement.height),
                    filetype = EXR.extension
                )
            }
            .forEach { versions.add(it) }

        versions.forEach { elementVersionDao.insert(it) }
        logger.info("Created ${versions.size} versions for element ${element.id}")

        val category = elementCategoryDao.get(element.categoryId)!!
        return mapElement(element, versions, category)
    }

    @GET
    @Path("/{elementId}")
    fun getElement(@PathParam("elementId") elementId: String): Element {
        val element = elementDao.get(elementId) ?: throw NotFoundException("Element not found")
        val versions = elementVersionDao.listForElement(elementId)
        val category = elementCategoryDao.get(element.categoryId)!!
        return mapElement(element, versions, category)
    }

    @GET
    @Path("/{elementId}/preview.jpg")
    @Consumes(WILDCARD)
    @Produces("image/jpeg")
    fun getElementPreviewImage(@PathParam("elementId") elementId: String): ByteArray {
        val element = elementDao.get(elementId) ?: throw NotFoundException("Element not found")
        val file = pathResolver.local(element).resolve(previewImageName).toFile()
        if (!file.exists()) {
            logger.warn("Element $elementId has no preview image")
            throw NotFoundException()
        }
        return file.readBytes()
    }

    @GET
    @Path("/{elementId}/preview.mp4")
    @Consumes(WILDCARD)
    @Produces("video/mp4")
    fun getElementPreviewVideo(@PathParam("elementId") elementId: String): ByteArray {
        val element = elementDao.get(elementId) ?: throw NotFoundException("Element not found")
        val file = pathResolver.local(element).resolve(previewVideoName).toFile()
        if (!file.exists()) {
            logger.warn("Element $elementId has no preview video")
            throw NotFoundException()
        }
        return file.readBytes()
    }

    @PUT
    @Path("/{elementId}")
    fun updateElement(@PathParam("elementId") elementId: String, updateElement: UpdateElement) {
        val element = elementDao.get(elementId) ?: throw NotFoundException("Element not found")
        if (!element.previews) {
            throw BadRequestException("Can not update an element during import")
        }
        if (element.categoryId != updateElement.categoryId) {
            logger.info("Changing category from '${element.categoryId}' to '${updateElement.categoryId}' on element ${element.id}")
            elementDao.setCategory(element.id, updateElement.categoryId);
        }
        if (element.name != updateElement.name) {
            logger.info("Changing name from '${element.name}' to '${updateElement.name}' on element ${element.id}")
            val versions = elementVersionDao.listForElement(elementId)
            val frames = elementFrameDao.listForElement(elementId)

            val renamedElement = element.copy(name = updateElement.name)
            val oldPaths = filePaths(element, versions, frames)
            val newPaths = filePaths(renamedElement, versions, frames)
            val changedPaths = oldPaths.zip(newPaths).filter { (old, new) -> old != new }

            logger.info("Linking ${changedPaths.size} files")
            changedPaths.forEach { (old, new) ->
                Files.createDirectories(new.parent)
                Files.createLink(new, old)
            }

            logger.info("Updating database")
            elementDao.setName(element.id, updateElement.name)

            logger.info("Deleting ${changedPaths.size} files")
            deleteFiles(changedPaths.map { (old, _) -> old })
        }
    }

    @DELETE
    @Path("/{elementId}")
    fun deleteElement(@PathParam("elementId") elementId: String) {
        val element = elementDao.get(elementId) ?: return

        val now = ZonedDateTime.now().toEpochSecond();
        if (!element.previews && now - element.created < 60 * 60) {
            throw BadRequestException("Can not delete an element during import")
        }

        val versions = elementVersionDao.listForElement(elementId)
        val frames = elementFrameDao.listForElement(elementId)

        val paths = filePaths(element, versions, frames)

        logger.info("Updating database")
        elementFrameDao.deleteForElement(elementId)
        elementVersionDao.deleteForElement(elementId)
        elementDao.delete(elementId)

        logger.info("Deleting ${paths.size} files")
        deleteFiles(paths)

        logger.info("Deletion complete")
    }

    @PUT
    @Path("/{elementId}/frames/{frameNumber}")
    @Consumes("image/x-exr")
    fun importFrame(
        @PathParam("elementId") elementId: String,
        @PathParam("frameNumber") frameNumber: Int,
        data: ByteArray
    ) {
        val analysis = AnalysisApi().analyseExr(data)

        val element = elementDao.get(elementId) ?: throw NotFoundException("Element not found")
        val version = elementVersionDao.listForElement(elementId)[0] // FIXME: Assumes first is original

        if (analysis.channels != element.channels) {
            throw BadRequestException("Channels ${analysis.channels} do not match ${element.channels}")
        }
        if (analysis.width != version.width || analysis.height != version.height) {
            throw BadRequestException("Size ${analysis.width}x${analysis.height} does not match ${version.width}x${version.height}")
        }

        val frame = ElementFrameRow(
            elementId = element.id,
            number = frameNumber
        )

        logger.info("Importing frame $frameNumber/${element.framecount} for element ${element.id}")

        val file = pathResolver.local(element, version, frame).toFile()

        file.parentFile.mkdirs()
        file.writeBytes(data)

        elementFrameDao.insert(frame)
    }

    private fun mapElement(element: ElementRow, versions: List<ElementVersionRow>, category: ElementCategoryRow): Element {
        return Element(
            id = element.id,
            name = element.name,
            framecount = element.framecount,
            framerate = element.framerate,
            channels = element.channels,
            alpha = element.alpha,
            previews = element.previews,
            versions = versions.map { mapVersion(element, it) },
            category = mapCategory(category)
        )
    }

    private fun mapVersion(element: ElementRow, version: ElementVersionRow): ElementVersion {
        return ElementVersion(
            id = version.id,
            name = version.name,
            width = version.width,
            height = version.height,
            url = pathResolver.network(element, version)
        )
    }

    private fun mapCategory(category: ElementCategoryRow): ElementCategory {
        return ElementCategory(
            id = category.id,
            name = category.name,
            elements = 0 // TODO
        )
    }

    // All files related to an element
    private fun filePaths(element: ElementRow, versions: List<ElementVersionRow>, frames: List<ElementFrameRow>): List<FilePath> {
        val framePaths = versions.flatMap { version ->
            frames.map { frame ->
                pathResolver.local(element, version, frame)
            }
        }
        val previewPaths = listOf(previewImageName, previewVideoName).map { file ->
            pathResolver.local(element).resolve(file)
        }
        return (framePaths + previewPaths)
    }

    private fun deleteFiles(paths: List<FilePath>) {
        paths.forEach { path ->
            try {
                Files.delete(path)
            } catch (e: NoSuchFileException) {
                // If it does not exist, we have achieved the goal
                // (but log a warning since it might be the wrong path)
                logger.warn("Tried to delete non-existent file {}", path)
            }
            // Delete parent directory if empty
            try {
                Files.deleteIfExists(path.parent)
            } catch (e: DirectoryNotEmptyException) {
                // Expected
            }
        }
    }

}
