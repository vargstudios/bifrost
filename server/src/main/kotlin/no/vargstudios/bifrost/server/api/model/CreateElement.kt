package no.vargstudios.bifrost.server.api.model

data class CreateElement(
    val categoryId: String,
    val name: String,
    val framecount: Int,
    // From analysis:
    val width: Int,
    val height: Int,
    val framerate: Int,
    val channels: String,
    val alpha: Boolean
)
