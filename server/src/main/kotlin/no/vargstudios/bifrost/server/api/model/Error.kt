package no.vargstudios.bifrost.server.api.model

data class Error(
    val code: Int,
    val reason: String,
    val details: String
)
