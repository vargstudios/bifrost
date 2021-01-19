package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.CreateElement
import no.vargstudios.bifrost.server.api.model.Element
import no.vargstudios.bifrost.server.api.model.ElementVersion
import no.vargstudios.bifrost.server.db.ElementDao
import no.vargstudios.bifrost.server.db.ElementFrameDao
import no.vargstudios.bifrost.server.db.ElementVersionDao
import no.vargstudios.bifrost.server.db.model.ElementFrameRow
import no.vargstudios.bifrost.server.db.model.ElementRow
import no.vargstudios.bifrost.server.db.model.ElementVersionRow
import no.vargstudios.bifrost.server.exr.ExrAttributeParser
import no.vargstudios.bifrost.server.service.PathResolver
import no.vargstudios.bifrost.worker.api.model.ImageFormat.EXR
import no.vargstudios.bifrost.worker.api.model.ImageFormat.JPEG
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import javax.ws.rs.core.MediaType.WILDCARD

@Path("/api/v1/elements")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class ElementApi(
    val elementDao: ElementDao,
    val elementVersionDao: ElementVersionDao,
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
                mapElement(element, versions)
            }
    }

    @POST
    fun createElement(createElement: CreateElement): Element {
        val element = ElementRow(
            categoryId = createElement.categoryId,
            name = createElement.name,
            framecount = createElement.framecount,
            framerate = createElement.framerate,
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
                    name = "${width/1024}K",
                    width = width,
                    height = width * createElement.height / createElement.width,
                    filetype = EXR.extension
                )
            }
            .forEach { versions.add(it) }

        versions.forEach { elementVersionDao.insert(it) }
        logger.info("Created ${versions.size} versions for element ${element.id}")

        return mapElement(element, versions)
    }

    @GET
    @Path("/{elementId}")
    fun getElement(@PathParam("elementId") elementId: String): Element {
        val element = elementDao.get(elementId) ?: throw NotFoundException()
        val versions = elementVersionDao.listForElement(elementId)
        return mapElement(element, versions)
    }

    @GET
    @Path("/{elementId}/previews/image")
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
    @Path("/{elementId}/previews/video")
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
    @Path("/{elementId}/frames/{frameNumber}")
    @Consumes("image/x-exr")
    fun importFrame(
        @PathParam("elementId") elementId: String,
        @PathParam("frameNumber") frameNumber: Int,
        data: ByteArray
    ) {
        try {
            ExrAttributeParser(data).parse();
            // TODO: Check size, linear, alpha
        } catch (e: IllegalArgumentException) {
            logger.warn("Invalid OpenEXR-file", e)
            throw NotSupportedException()
        }

        val element = elementDao.get(elementId) ?: throw NotFoundException()
        val version = elementVersionDao.listForElement(elementId)[0] // FIXME: Assumes first is original
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

    private fun mapElement(element: ElementRow, versions: List<ElementVersionRow>): Element {
        return Element(
            id = element.id,
            name = element.name,
            framecount = element.framecount,
            framerate = element.framerate,
            alpha = element.alpha,
            versions = versions.map { mapVersion(it) }
        )
    }

    private fun mapVersion(version: ElementVersionRow): ElementVersion {
        return ElementVersion(
            id = version.id,
            name = version.name,
            width = version.width,
            height = version.height
        )
    }

}
