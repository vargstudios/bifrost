package no.vargstudios.bifrost.server.api.model

data class UpdateElementCategory(
    val name: String,
    val dummy: String? // Jackson fails if there is only one property
)
