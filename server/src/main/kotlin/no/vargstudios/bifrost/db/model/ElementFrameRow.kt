package no.vargstudios.bifrost.db.model

import no.vargstudios.bifrost.util.randomId

data class ElementFrameRow(
    val id: String = randomId(),
    val elementId: String,
    val number: Int,
    val transcoded: Boolean
)
