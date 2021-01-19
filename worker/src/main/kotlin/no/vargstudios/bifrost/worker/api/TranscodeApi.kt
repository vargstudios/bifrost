package no.vargstudios.bifrost.worker.api

import no.vargstudios.bifrost.worker.api.model.Image
import no.vargstudios.bifrost.worker.api.model.ImageFormat
import no.vargstudios.bifrost.worker.api.model.TranscodeImagesRequest
import no.vargstudios.bifrost.worker.api.model.TranscodeVideoRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1/transcode")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class TranscodeApi() {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    @POST
    @Path("/images")
    fun transcodeImages(request: TranscodeImagesRequest): List<Image> {
        if (request.image.spec.format != ImageFormat.EXR) {
            throw BadRequestException("Input image must be EXR")
        }
        val dir = createTempDir("images")
        try {
            logger.info("Input image is ${request.image.spec}")
            val source = dir.resolve("source.${request.image.spec.format.extension}")
            source.writeBytes(request.image.data)

            return request.specs.map { spec ->
                logger.info("Transcoding to $spec")
                val target = dir.resolve("target-${spec.width}x${spec.height}.${spec.format.extension}")
                if (spec.format == ImageFormat.EXR) {
                    // EXR to EXR: Resize only
                    resize(source, target, spec.width, spec.height)
                } else {
                    // EXR to *: Resize and convert to sRGB
                    resizeToSRGB(source, target, spec.width, spec.height)
                }
                Image(
                    spec = spec,
                    data = target.readBytes()
                )
            }
        } finally {
            dir.deleteRecursively()
        }
    }

    @POST
    @Path("/video")
    @Produces("video/mp4")
    fun transcodeVideo(request: TranscodeVideoRequest): ByteArray {
        if (request.images.isEmpty()) {
            throw BadRequestException("No images")
        }
        val specs = request.images.map { it.spec }.toSet()
        if (specs.size > 1) {
            throw BadRequestException("Not all images have the same spec")
        }
        val dir = createTempDir("video")
        try {
            logger.info("Saving ${request.images.size} images...")
            request.images.mapIndexed { index, image ->
                val frame = dir.resolve("%06d".format(index) + "." + image.spec.format.extension)
                frame.writeBytes(image.data)
            }

            logger.info("Creating video...")
            val sources = dir.resolve("*.${request.images[0].spec.format.extension}")
            val target = dir.resolve("video.mp4")
            createVideo(sources, target, request.framerate)

            return target.readBytes()
        } finally {
            dir.deleteRecursively()
        }
    }

    private fun resize(source: File, target: File, width: Int, height: Int) {
        logDuration("resize") {
            val exitCode = ProcessBuilder()
                .command(
                    "oiiotool", source.absolutePath,
                    "--resize", "${width}x${height}",
                    "-o", target.absolutePath
                )
                .start()
                .waitFor()

            if (exitCode != 0) {
                throw RuntimeException("oiiotool exited with status $exitCode")
            }
        }
    }

    private fun resizeToSRGB(source: File, target: File, width: Int, height: Int) {
        logDuration("resizeToSRGB") {
            val exitCode = ProcessBuilder()
                .command(
                    "oiiotool", source.absolutePath,
                    "--resize", "${width}x${height}",
                    "--ch", "R,G,B",
                    "--tocolorspace", "sRGB",
                    "-o", target.absolutePath
                )
                .start()
                .waitFor()

            if (exitCode != 0) {
                throw RuntimeException("oiiotool exited with status $exitCode")
            }
        }
    }

    private fun createVideo(sources: File, target: File, framerate: Int) {
        logDuration("createVideo") {
            val exitCode = ProcessBuilder()
                .command(
                    "ffmpeg",
                    "-framerate", "$framerate",
                    "-pattern_type", "glob",
                    "-i", sources.absolutePath,
                    "-c:v", "libx264",
                    "-preset", "slow",
                    "-pix_fmt", "yuv420p",
                    "-crf", "12",
                    "-y", target.absolutePath
                )
                .start()
                .waitFor()

            if (exitCode != 0) {
                throw RuntimeException("oiiotool exited with status $exitCode")
            }
        }
    }

    private fun logDuration(name: String, func: () -> Unit) {
        val before = System.currentTimeMillis()
        func()
        val after = System.currentTimeMillis()
        logger.info("$name took ${after - before} ms")
    }
}
