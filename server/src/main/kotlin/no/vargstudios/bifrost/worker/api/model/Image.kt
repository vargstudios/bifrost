package no.vargstudios.bifrost.worker.api.model

data class Image(
    val spec: ImageSpec,
    val data: ByteArray
)
