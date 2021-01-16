package no.vargstudios.bifrost.api.model

data class TranscodeImagesRequest(
    val specs: List<ImageSpec>,
    val image: Image
)