package no.vargstudios.bifrost.worker.api.model

data class TranscodeImagesRequest(
    val specs: List<ImageSpec>,
    val image: Image
)
