package no.vargstudios.bifrost.api.model

data class ExrAnalysis(
    val width: Int,
    val height: Int,
    val framerate: Float,
    val linear: Boolean,
    val alpha: Boolean
)
