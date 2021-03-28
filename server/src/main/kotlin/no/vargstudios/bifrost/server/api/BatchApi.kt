package no.vargstudios.bifrost.server.api


import no.vargstudios.bifrost.server.api.model.CreateElement
import no.vargstudios.bifrost.server.api.model.batch.*
import no.vargstudios.bifrost.server.api.model.batch.BatchImportElementsState.*
import no.vargstudios.bifrost.server.api.model.batch.BatchItemStatus.*
import no.vargstudios.bifrost.server.service.ScanService
import no.vargstudios.bifrost.server.util.randomId
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.time.ZonedDateTime
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
    var importElementsState: BatchImportElementsState = Scanned(scanned = listOf(), time = 0)
    var importElementsFrames: Map<String, List<File>> = emptyMap()

    @GET
    @Path("/import-elements/state")
    fun stateElements(): BatchImportElementsState {
        return importElementsState
    }

    @POST
    @Path("/import-elements/scan")
    fun scanElements() {
        // Start the scan process
        if (importElementsState is Scanning && importElementsState is Importing) {
            throw BadRequestException("Scan or import in progress")
        }
        importElementsState = Scanning()

        thread {
            // Scan
            val scannedElements = mutableListOf<BatchScannedElement>()
            val scannedElementFrames = mutableMapOf<String, List<File>>()

            try {
                scanService.scanForExrSequences()
                    .filter { sequence -> sequence.consecutive }
                    .forEach { sequence ->
                        try {
                            val firstExr = sequence.files.first().readBytes()
                            val analysis = analysisApi.analyseExr(firstExr)
                            val scannedElement = BatchScannedElement(
                                scanId = randomId(),
                                name = sequence.name,
                                framecount = sequence.files.size,
                                width = analysis.width,
                                height = analysis.height,
                                framerate = analysis.framerate.toInt(),
                                channels = analysis.channels,
                                alpha = analysis.alpha
                            )
                            scannedElements.add(scannedElement)
                            scannedElementFrames[scannedElement.scanId] = sequence.files
                        } catch (e: Exception) {
                            logger.error("Analysis error", e)
                        }
                    }
            } catch (e: Exception) {
                logger.error("Scan error", e)
            }

            // Save results
            importElementsState = Scanned(scanned = scannedElements, time = ZonedDateTime.now().toEpochSecond())
            importElementsFrames = scannedElementFrames
        }
    }

    @POST
    @Path("/import-elements/import")
    fun importElements(elements: List<BatchCreateElement>) {
        if (importElementsState is Scanning && importElementsState is Importing) {
            throw BadRequestException("Scan or import in progress")
        }

        // Prepare elements with frames
        val scannedElements = (importElementsState as Scanned).scanned
        val createElements = elements.map { element ->
            val scannedElement = scannedElements
                .firstOrNull { scannedElement -> scannedElement.scanId == element.scanId }
                ?: throw BadRequestException("Invalid scanId")

            val createElement = CreateElement(
                categoryId = element.categoryId,
                name = element.name,
                framecount = scannedElement.framecount,
                width = scannedElement.width,
                height = scannedElement.height,
                framerate = scannedElement.framerate,
                channels = scannedElement.channels,
                alpha = scannedElement.alpha
            )
            Pair(scannedElement.scanId, createElement)
        }

        // Keep track of status for each item
        val createElementStatuses = mutableMapOf<String, BatchItemStatus>()

        thread {
            createElements.forEach { (scanId, createElement) ->
                logger.info("Batch importing $createElement")
                try {
                    // Update state with progress
                    importElementsState = Importing(
                        scanned = scannedElements,
                        items = createElements.map { (scanId, createElement) ->
                            BatchImportElementItem(
                                element = createElement,
                                status = createElementStatuses[scanId] ?: PENDING
                            )
                        })

                    // Import element with frames
                    val frames = importElementsFrames[scanId]
                        ?: throw IllegalStateException("No frames for scanId")

                    val createdElement = elementApi.createElement(createElement)
                    frames.forEachIndexed { index, frame ->
                        elementApi.importFrame(
                            createdElement.id,
                            index + 1,
                            frame.readBytes()
                        )
                    }

                    createElementStatuses[scanId] = SUCCESS
                } catch (e: Exception) {
                    createElementStatuses[scanId] = FAILURE
                    logger.error("Import error", e)
                }
            }

            // Final state (now "Imported" instead of "Importing")
            importElementsState = Imported(
                scanned = scannedElements,
                items = createElements.map { (scanId, createElement) ->
                    BatchImportElementItem(
                        element = createElement,
                        status = createElementStatuses[scanId] ?: FAILURE
                    )
                },
                time = ZonedDateTime.now().toEpochSecond()
            )
        }
    }

}
