package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.BatchCreateElement
import no.vargstudios.bifrost.server.api.model.CreateElement
import no.vargstudios.bifrost.server.api.model.ScannedElement
import no.vargstudios.bifrost.server.service.ScanService
import no.vargstudios.bifrost.server.util.randomId
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON
import kotlin.concurrent.thread

@Path("/api/v1/batch")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class BatchApi(
    val analysisApi: AnalysisApi,
    val elementApi: ElementApi,
    val scanService: ScanService
) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    // Cached scanned elements
    var scannedElements: List<Pair<ScannedElement, List<File>>> = listOf()
    var importInProgress: Boolean = false

    @POST
    @Path("/scan-elements")
    fun scan(): List<ScannedElement> {
        scannedElements = scanService.scanForExrSequences()
            .filter { sequence -> sequence.consecutive }
            .map { sequence ->
                val firstExr = sequence.files.first().readBytes()
                val analysis = analysisApi.analyseExr(firstExr) // TODO: Handle invalid files
                val element = ScannedElement(
                    scanId = randomId(),
                    name = sequence.name,
                    framecount = sequence.files.size,
                    width = analysis.width,
                    height = analysis.height,
                    framerate = analysis.framerate.toInt(),
                    channels = analysis.channels,
                    alpha = analysis.alpha
                )
                Pair(element, sequence.files)
            }
        return scannedElements.map { (scanned, _) -> scanned }
    }

    @POST
    @Path("/import-elements")
    fun import(elements: List<BatchCreateElement>) {
        // Match elements with scanned
        val matchedElements = elements.map { element ->
            val (scanned, files) = scannedElements
                .firstOrNull { (scanned, _) -> scanned.scanId == element.scanId }
                ?: throw BadRequestException("Invalid scanId")

            Triple(element, scanned, files)
        }

        // Import elements in background
        if (importInProgress) {
            throw BadRequestException("Import in progress")
        }
        thread {
            importInProgress = true
            matchedElements.forEach { (element, scanned, files) ->
                logger.info("Batch importing $element $scanned")
                try {
                    val createdElement = elementApi.createElement(
                        CreateElement(
                            categoryId = element.categoryId,
                            name = element.name,
                            framecount = scanned.framecount,
                            width = scanned.width,
                            height = scanned.height,
                            framerate = scanned.framerate,
                            channels = scanned.channels,
                            alpha = scanned.alpha
                        )
                    )
                    files.forEachIndexed { index, file ->
                        elementApi.importFrame(
                            createdElement.id,
                            index + 1,
                            file.readBytes()
                        )
                    }
                } catch (e: Exception) {
                    logger.error("Import error", e)
                }
            }
            importInProgress = false
        }
    }

}
