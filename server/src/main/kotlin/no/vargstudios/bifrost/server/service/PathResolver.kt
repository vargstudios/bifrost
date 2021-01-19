package no.vargstudios.bifrost.server.service

import no.vargstudios.bifrost.server.db.model.ElementFrameRow
import no.vargstudios.bifrost.server.db.model.ElementRow
import no.vargstudios.bifrost.server.db.model.ElementVersionRow
import org.eclipse.microprofile.config.inject.ConfigProperty
import java.nio.file.Path
import javax.inject.Singleton

@Singleton
class PathResolver(
    @ConfigProperty(name = "data.path.local") private val dataPathLocal: String,
    @ConfigProperty(name = "data.path.remote") private val dataPathRemote: String,
    @ConfigProperty(name = "element.root.name") private val elementRootName: String,
    @ConfigProperty(name = "element.version.name") private val elementVersionName: String,
    @ConfigProperty(name = "element.frame.name") private val elementFrameName: String
) {

    fun local(element: ElementRow): Path =
        Path.of(dataPathLocal, name(element))

    fun local(element: ElementRow, version: ElementVersionRow): Path =
        Path.of(dataPathLocal, name(element), name(element, version))

    fun local(element: ElementRow, version: ElementVersionRow, frame: ElementFrameRow): Path =
        Path.of(dataPathLocal, name(element), name(element, version), name(element, version, frame))

    private fun name(element: ElementRow): String =
        sanitizeText(elementRootName.format(element))

    private fun name(element: ElementRow, version: ElementVersionRow): String =
        sanitizeText(elementVersionName.format(element).format(version))

    private fun name(element: ElementRow, version: ElementVersionRow, frame: ElementFrameRow): String =
        sanitizeText(elementFrameName.format(element).format(version).format(frame))

    private fun String.format(element: ElementRow): String = this
        .replace("{element_id}", sanitizeText(element.id))
        .replace("{element_name}", sanitizeText(element.name))

    private fun String.format(version: ElementVersionRow): String = this
        .replace("{version_id}", sanitizeText(version.name))
        .replace("{version_name}", sanitizeText(version.name))
        .replace("{version_width}", formatNumber(version.width))
        .replace("{version_height}", formatNumber(version.height))
        .replace("{version_filetype}", sanitizeText(version.filetype))

    private fun String.format(frame: ElementFrameRow): String = this
        .replace("{frame_id}", sanitizeText(frame.id))
        .replace("{frame_number}", formatNumber(frame.number))

    private fun sanitizeText(text: String): String =
        text.replace(Regex("[^A-Za-z0-9._-]"), "_")

    private fun formatNumber(number: Int): String =
        number.toString().padStart(6, '0')
}
