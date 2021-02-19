package no.vargstudios.bifrost.server.api.model

data class Name(
    val value: String,
    val dummy: String? // Jackson fails if there is only one property
)
