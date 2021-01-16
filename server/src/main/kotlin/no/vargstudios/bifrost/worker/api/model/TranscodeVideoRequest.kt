package no.vargstudios.bifrost.worker.api.model

data class TranscodeVideoRequest(
    val framerate: Int,
    val images: List<Image>
)
