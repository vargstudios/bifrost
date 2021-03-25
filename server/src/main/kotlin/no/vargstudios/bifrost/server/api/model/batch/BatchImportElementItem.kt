package no.vargstudios.bifrost.server.api.model.batch

import no.vargstudios.bifrost.server.api.model.CreateElement

data class BatchImportElementItem(
    val element: CreateElement,
    val status: BatchItemStatus
)
