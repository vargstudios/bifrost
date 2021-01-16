package no.vargstudios.bifrost.api

import no.vargstudios.bifrost.api.model.CreateElement
import no.vargstudios.bifrost.api.model.Element
import no.vargstudios.bifrost.api.model.ElementVersion
import no.vargstudios.bifrost.db.ElementDao
import no.vargstudios.bifrost.db.ElementVersionDao
import no.vargstudios.bifrost.db.model.ElementRow
import no.vargstudios.bifrost.db.model.ElementVersionRow
import no.vargstudios.bifrost.util.*
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
        if (!isExr(data)) {
            logger.warn("Invalid OpenEXR-file")
            throw NotSupportedException()
        }

        val element = elementDao.get(elementId) ?: throw NotFoundException()
        val versions = elementVersionDao.listForElement(elementId)

        logger.info("Importing frame $frameNumber/${element.framecount} for element ${element.id}")

        // Original
        val originalVersion = versions[0]
        val original = Paths.get(
            dataPathLocal,
            folderName(element),
            folderName(originalVersion),
            fileName(element, originalVersion, frameNumber)
        ).toFile()

        original.parentFile.mkdirs()
        original.writeBytes(data)

        if (false) {
            return;
        }

        // Other versions
        versions.filter { version -> version.name != originalName }.forEach { version ->
            val target = Paths.get(
                dataPathLocal,
                folderName(element),
                folderName(version),
                fileName(element, version, frameNumber)
            ).toFile()

            target.parentFile.mkdirs()
            target.createNewFile()

            if (version.filetype == "exr") {
                resize(original, target, version.width, version.height)
            } else {
                resizeToSRGB(original, target, version.width, version.height)
            }
        }

        // Create previews
        if (frameNumber == element.framecount) {
            versions.filter { version -> version.name == previewName }.forEach { version ->
                run {
                    // Video
                    val sources = Paths.get(
                        dataPathLocal,
                        folderName(element),
                        folderName(version),
                        "*.jpg"
                    ).toFile()
                    val target = Paths.get(
                        dataPathLocal,
                        folderName(element),
                        previewVideoName
                    ).toFile()
                    createVideo(sources, target, element.framerate)
                }
                run {
                    // Image
                    val source = Paths.get(
                        dataPathLocal,
                        folderName(element),
                        folderName(version),
                        fileName(element, version, element.framecount / 2) // TODO: Allow selection
                    ).toFile()
                    val target = Paths.get(
                        dataPathLocal,
                        folderName(element),
                        previewImageName
                    ).toFile()
                    convert(source, target)
                }
            }
        }
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
