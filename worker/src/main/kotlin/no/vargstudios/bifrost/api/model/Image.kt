package no.vargstudios.bifrost.api.model

data class Image(
    val spec: ImageSpec,
    val data: ByteArray
)