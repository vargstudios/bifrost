package no.vargstudios.bifrost.util

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.lang.System.currentTimeMillis
import java.lang.invoke.MethodHandles

val logger: Logger = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass())

fun isExr(data: ByteArray): Boolean {
    // Check OpenEXR magic number
    // https://www.openexr.com/documentation/openexrfilelayout.pdf
    return data.take(4) == listOf<Byte>(0x76, 0x2f, 0x31, 0x01)
}

fun resize(source: File, target: File, width: Int, height: Int) {
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

fun resizeToSRGB(source: File, target: File, width: Int, height: Int) {
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

fun createVideo(sources: File, target: File, framerate: Int) {
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

fun convert(source: File, target: File) {
    logDuration("convert") {
        val exitCode = ProcessBuilder()
                .command(
                        "oiiotool", source.absolutePath,
                        "-o", target.absolutePath
                )
                .start()
                .waitFor()

        if (exitCode != 0) {
            throw RuntimeException("oiiotool exited with status $exitCode")
        }
    }
}

fun logDuration(name: String, func: () -> Unit) {
    val before = currentTimeMillis()
    func()
    val after = currentTimeMillis()
    logger.info("$name took ${after - before} ms")
}