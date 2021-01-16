package no.vargstudios.bifrost.server.db.model

import no.vargstudios.bifrost.server.util.randomId

data class TagRow(
    val id: String = randomId(),
    val name: String
)
