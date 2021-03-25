package no.vargstudios.bifrost.server.api.model.batch

data class BatchCreateElement(
    val scanId: String,
    val categoryId: String,
    val name: String
)
