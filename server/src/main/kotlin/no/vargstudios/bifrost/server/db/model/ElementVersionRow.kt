package no.vargstudios.bifrost.server.db.model

import no.vargstudios.bifrost.server.util.randomId

data class ElementVersionRow(
    val id: String = randomId(),
    val elementId: String,
    val name: String,
    val width: Int,
    val height: Int,
    val filetype: String
)
