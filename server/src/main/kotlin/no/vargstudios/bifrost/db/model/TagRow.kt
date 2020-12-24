package no.vargstudios.bifrost.db.model

import no.vargstudios.bifrost.util.randomId

data class TagRow(
        val id: String = randomId(),
        val name: String
)
