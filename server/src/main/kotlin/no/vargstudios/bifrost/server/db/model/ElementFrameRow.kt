package no.vargstudios.bifrost.server.db.model

import no.vargstudios.bifrost.server.util.randomId

data class ElementFrameRow(
    val id: String = randomId(),
    val elementId: String,
    val number: Int,
    val transcoded: Boolean
)
