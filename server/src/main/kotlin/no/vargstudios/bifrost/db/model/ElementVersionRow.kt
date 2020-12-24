package no.vargstudios.bifrost.db.model

import no.vargstudios.bifrost.util.randomId

data class ElementVersionRow(
        val id: String = randomId(),
        val elementId: String,
        val name: String,
        val width: Int,
        val height: Int,
        val filetype: String,
        val bytes: Int
)
