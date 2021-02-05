package no.vargstudios.bifrost.server.api.model

data class ExrAnalysis(
    val width: Int,
    val height: Int,
    val framerate: Float,
    val channels: String,
    val linear: Boolean,
    val alpha: Boolean
)
