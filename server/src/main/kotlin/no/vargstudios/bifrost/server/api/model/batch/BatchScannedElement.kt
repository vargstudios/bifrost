package no.vargstudios.bifrost.server.api.model.batch

data class BatchScannedElement(
    val scanId: String,
    val name: String,
    val framecount: Int,
    // From analysis:
    val width: Int,
    val height: Int,
    val framerate: Int,
    val channels: String,
    val alpha: Boolean
)
