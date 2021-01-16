package no.vargstudios.bifrost.api.model

data class TranscodeVideoRequest(
    val framerate: Int,
    val images: List<Image>
)