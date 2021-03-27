package no.vargstudios.bifrost.server.service

import io.quarkus.scheduler.Scheduled
import io.quarkus.scheduler.Scheduled.ConcurrentExecution.SKIP
import no.vargstudios.bifrost.server.db.ElementDao
import no.vargstudios.bifrost.server.db.ElementFrameDao
import no.vargstudios.bifrost.server.db.ElementVersionDao
import no.vargstudios.bifrost.server.db.model.ElementFrameRow
import no.vargstudios.bifrost.server.db.model.ElementRow
import no.vargstudios.bifrost.server.db.model.ElementVersionRow
import no.vargstudios.bifrost.worker.api.model.*
import no.vargstudios.bifrost.worker.registry.WorkerPool
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.lang.System.currentTimeMillis
import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class WorkerScheduler(
    val workerPool: WorkerPool,
    val elementDao: ElementDao,
    val elementFrameDao: ElementFrameDao,
    val elementVersionDao: ElementVersionDao,
    val pathResolver: PathResolver
) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    @Scheduled(every = "3s", concurrentExecution = SKIP)
    fun queueTasks() {
        // Don't queue new tasks until worker pool is idle (prevents duplicate work)
        if (!workerPool.isIdle()) {
            return
        }
        queuePreviewTasks()
        queueTranscodeTasks()
    }

    private fun queuePreviewTasks() {
        val elements = elementDao.listReadyForPreviews()

        elements.forEach { element ->
            // FIXME: Assumes names
            val version = elementVersionDao.listForElement(element.id).find { it.name == "Preview" }!!
            val frames = elementFrameDao.listForElement(element.id)
            queuePreviewTask(element, version, frames)
        }
    }

    private fun queuePreviewTask(element: ElementRow, version: ElementVersionRow, frames: List<ElementFrameRow>) {
        workerPool.addTask { worker, apis ->
            logger.info("Generating preview for element=${element.id} on ${worker.url}")
            val before = currentTimeMillis()
            val video = apis.transcodeApi.transcodeVideo(
                TranscodeVideoRequest(
                    framerate = element.framerate,
                    images = frames.map { frame ->
                        Image(
                            spec = toImageSpec(version),
                            data = toFile(element, version, frame).readBytes()
                        )
                    }
                )
            )
            val after = currentTimeMillis()
            logger.info("Generating preview for element=${element.id} took ${after - before} ms")
            // TODO: Validate response

            // TODO: Extract contants
            // Store video
            pathResolver.local(element).resolve("preview.mp4").toFile().writeBytes(video)

            // Copy image
            val image = toFile(element, version, frames.find { it.number == element.framecount/2+1 }!!).readBytes()
            pathResolver.local(element).resolve("preview.jpg").toFile().writeBytes(image)

            // Mark previews generated
            elementDao.setPreviewsGenerated(element.id)
            logger.info("Generating previews for element=${element.id} done")
        }
    }

    private fun queueTranscodeTasks() {
        // List untranscoded frames
        val frames = elementFrameDao.listReadyForTranscode()

        // Fetch necessary data
        val elementIds = frames
            .map { it.elementId }
            .distinct()
        val elementIdToElement = elementIds
            .associateBy({ it }, { elementDao.get(it)!! })
        val elementIdToVersions = elementIds
            .associateBy({ it }, { elementVersionDao.listForElement(it) })

        // Create task for each frame
        frames.forEach { frame ->
            val element = elementIdToElement[frame.elementId]!!
            val versions = elementIdToVersions[frame.elementId]!!
            queueTranscodeTask(element, versions, frame)
        }
    }

    private fun queueTranscodeTask(element: ElementRow, versions: List<ElementVersionRow>, frame: ElementFrameRow) {
        // FIXME: Assumes first is original
        val sourceVersion = versions[0]
        val targetVersions = versions.drop(1)

        workerPool.addTask { worker, apis ->
            logger.info("Transcoding element=${frame.elementId} frame=${frame.number} on ${worker.url}")
            val before = currentTimeMillis()
            val images = apis.transcodeApi.transcodeImages(
                TranscodeImagesRequest(
                    specs = targetVersions.map { version ->
                        toImageSpec(version)
                    },
                    image = Image(
                        spec = toImageSpec(sourceVersion),
                        data = toFile(element, sourceVersion, frame).readBytes()
                    )
                )
            )
            val after = currentTimeMillis()
            logger.info("Transcoding element=${frame.elementId} frame=${frame.number} took ${after - before} ms")
            // TODO: Validate response

            // Store images
            images.forEach { image ->
                val version = targetVersions.find { toImageSpec(it) == image.spec }!!
                val file = toFile(element, version, frame)
                file.parentFile.mkdirs()
                file.writeBytes(image.data)
            }

            // Mark transcoded
            elementFrameDao.setTranscoded(frame.id)
            logger.info("Transcoding element=${frame.elementId} frame=${frame.number} done")
        }
    }

    private fun toImageSpec(version: ElementVersionRow): ImageSpec {
        return ImageSpec(
            width = version.width,
            height = version.height,
            format = ImageFormat.values().find { it.extension == version.filetype }!!
        )
    }

    private fun toFile(element: ElementRow, version: ElementVersionRow, frame: ElementFrameRow): File {
        return pathResolver.local(element, version, frame).toFile()
    }

}
