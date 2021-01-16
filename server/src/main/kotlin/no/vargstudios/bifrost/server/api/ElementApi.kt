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
import no.vargstudios.bifrost.server.util.fileName
import no.vargstudios.bifrost.server.util.folderName
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.nio.file.Paths
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
    @ConfigProperty(name = "data.path.local")
    val dataPathLocal: String
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

        val versions = mutableListOf(
            ElementVersionRow(
                elementId = element.id,
                name = originalName,
                width = createElement.width,
                height = createElement.height,
                filetype = "exr"
            ),
            ElementVersionRow(
                elementId = element.id,
                name = previewName,
                width = 480,
                height = 480 * createElement.height / createElement.width,
                filetype = "jpg"
            )
        )
        if (createElement.width > 4096 * 1.25) {
            versions.add(
                ElementVersionRow(
                    elementId = element.id,
                    name = "4K",
                    width = 4096,
                    height = 4096 * createElement.height / createElement.width,
                    filetype = "exr"
                )
            )
        }
        if (createElement.width > 2048 * 1.25) {
            versions.add(
                ElementVersionRow(
                    elementId = element.id,
                    name = "2K",
                    width = 2048,
                    height = 2048 * createElement.height / createElement.width,
                    filetype = "exr"
                )
            )
        }
        if (createElement.width > 1024 * 1.25) {
            versions.add(
                ElementVersionRow(
                    elementId = element.id,
                    name = "1K",
                    width = 1024,
                    height = 1024 * createElement.height / createElement.width,
                    filetype = "exr"
                )
            )
        }

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
        val file = Paths.get(dataPathLocal, folderName(element), previewImageName).toFile()
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
        val file = Paths.get(dataPathLocal, folderName(element), previewVideoName).toFile()
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
        val version = elementVersionDao.listForElement(elementId)[0] // TODO: Assumes original is first

        logger.info("Importing frame $frameNumber/${element.framecount} for element ${element.id}")

        val file = Paths.get(
            dataPathLocal,
            folderName(element),
            folderName(version),
            fileName(element, version, frameNumber)
        ).toFile()

        file.parentFile.mkdirs()
        file.writeBytes(data)

        elementFrameDao.insert(
            ElementFrameRow(
                elementId = element.id,
                number = frameNumber,
                transcoded = false
            )
        )
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
