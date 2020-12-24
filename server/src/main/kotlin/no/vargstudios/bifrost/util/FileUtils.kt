package no.vargstudios.bifrost.util

import no.vargstudios.bifrost.db.model.ElementRow
import no.vargstudios.bifrost.db.model.ElementVersionRow

fun folderName(element: ElementRow): String {
    // Name + 8 chars should ensure enough uniqueness
    return normalize(element.name) + "_" + element.id.substring(0, 8)
}

fun folderName(version: ElementVersionRow): String {
    return normalize(version.name)
}

fun fileName(element: ElementRow, version: ElementVersionRow, frameNumber: Int): String {
    return normalize(element.name) + "_" + normalize(version.name) + "_" + format(frameNumber) + "." + version.filetype
}

fun normalize(name: String): String {
    return name.replace(" ", "_")
            .replace(Regex("[^A-Za-z0-9_-]"), "")
}

private fun format(number: Int): String {
    return "%06d".format(number)
}
