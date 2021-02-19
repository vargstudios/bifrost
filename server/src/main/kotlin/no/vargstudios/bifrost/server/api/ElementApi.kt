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
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.MediaType.WILDCARD

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
                val category = elementCategoryDao.get(element.categoryId) ?: throw IllegalStateException("Element has non-existing category")
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
                width = 480,
                height = 480 * createElement.height / createElement.width,
                filetype = JPEG.extension
            )
        )

        // Conditional versions
        listOf(8192, 4096, 2048, 1024)
            .filter { width -> width * 1.5 < createElement.width }
            .map { width ->
                ElementVersionRow(
                    elementId = element.id,
                    name = "${width / 1024}K",
                    width = width,
                    height = width * createElement.height / createElement.width,
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
        val element = elementDao.get(elementId) ?: throw NotFoundException()
        val versions = elementVersionDao.listForElement(elementId)
        val category = elementCategoryDao.get(element.categoryId)!!
        return mapElement(element, versions, category)
    }

    @GET
    @Path("/{elementId}/preview.jpg")
    @Consumes(WILDCARD)
    @Produces("image/jpeg")
    fun getElementPreviewImage(@PathParam("elementId") elementId: String): ByteArray {
        val element = elementDao.get(elementId) ?: throw NotFoundException()
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
        val element = elementDao.get(elementId) ?: throw NotFoundException()
        val file = pathResolver.local(element).resolve(previewVideoName).toFile()
        if (!file.exists()) {
            logger.warn("Element $elementId has no preview video")
            throw NotFoundException()
        }
        return file.readBytes()
    }

    @PUT
    @Path("/{elementId}/name")
    fun renameElement(@PathParam("elementId") elementId: String, name: Name) {
        val element = elementDao.get(elementId) ?: throw NotFoundException()
        if (!element.previews) {
            throw BadRequestException("Can not rename an element that is not fully imported")
        }
        if (element.name == name.value) {
            logger.warn("Name unchanged")
            return
        }
        val versions = elementVersionDao.listForElement(elementId)
        val frames = elementFrameDao.listForElement(elementId)

        logger.info("Changing name from '${element.name}' to '${name.value}' on element ${element.id} ")
        val renamedElement = element.copy(name = name.value)

        val framePaths = versions.flatMap { version ->
            frames.map { frame ->
                val old = pathResolver.local(element, version, frame)
                val new = pathResolver.local(renamedElement, version, frame)
                Pair(old, new)
            }
        }
        val previewPaths = listOf(previewImageName, previewVideoName).map { file ->
            val old = pathResolver.local(element).resolve(file)
            val new = pathResolver.local(renamedElement).resolve(file)
            Pair(old, new)
        }

        val changedPaths = (framePaths + previewPaths).filter { (old, new) -> old != new }

        logger.info("Linking ${changedPaths.size} files")
        changedPaths.forEach { (old, new) ->
            Files.createDirectories(new.parent)
            Files.createLink(new, old)
        }

        logger.info("Updating database")
        elementDao.setName(element.id, name.value)

        logger.info("Deleting ${changedPaths.size} files")
        changedPaths.forEach { (old, _) ->
            Files.delete(old)
            try {
                Files.deleteIfExists(old.parent)
            } catch (e: DirectoryNotEmptyException) {
                // Expected. We want to delete directories if they are empty.
            }
        }

        logger.info("Name change complete")
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
        if (!analysis.linear) {
            throw BadRequestException("Not linear")
        }

        val element = elementDao.get(elementId) ?: throw NotFoundException()
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

}
