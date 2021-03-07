package no.vargstudios.bifrost.server.service

import no.vargstudios.bifrost.server.service.model.Exr
import no.vargstudios.bifrost.server.service.model.ExrSequence
import no.vargstudios.bifrost.server.util.parseFilename
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class ScanService(@ConfigProperty(name = "scan.path") private val scanPath: String) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    fun scanForExrSequences(): List<ExrSequence> {
        logger.info("Scanning...")

        // Find all EXRs with parsable names
        val exrs: List<Exr> = File(scanPath).walk()
            .filter { file -> file.isFile }
            .filter { file -> file.name.endsWith(suffix = ".exr", ignoreCase = true) }
            .map { file ->
                val filename = parseFilename(file.name) ?: return@map null
                Exr(filename.name, filename.sequence, file)
            }
            .filterNotNull()
            .toList()

        logger.info("Found ${exrs.size} EXRs")

        // Group into sequences
        val exrSequences: List<ExrSequence> = exrs
            .sortedBy { exr -> exr.number }
            .groupBy { exr -> exr.name }
            .map { (name, exrs) ->
                val consecutive = exrs.map { exr -> exr.number }
                    .zipWithNext { a, b -> a + 1 == b }
                    .all { it }
                val files = exrs.map { exr -> exr.file }
                ExrSequence(name, consecutive, files)
            }

        logger.info("Found ${exrSequences.size} EXR sequences")

        return exrSequences
    }

}
