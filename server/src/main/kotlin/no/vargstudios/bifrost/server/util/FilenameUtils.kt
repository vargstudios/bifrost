package no.vargstudios.bifrost.server.util

data class Filename(
    val name: String,
    val sequence: Int,
    val extension: String
)

fun parseFilename(filename: String): Filename? {
    val re = Regex("^(.+?)[._-]([0-9]+)\\.([^.]+)\$")
    val match = re.matchEntire(filename) ?: return null
    return Filename(
        match.groupValues[1],
        match.groupValues[2].toInt(),
        match.groupValues[3]
    )
}
