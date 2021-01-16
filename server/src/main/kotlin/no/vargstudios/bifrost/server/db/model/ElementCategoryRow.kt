package no.vargstudios.bifrost.server.db.model

import no.vargstudios.bifrost.server.util.randomId
import java.time.OffsetDateTime

data class ElementCategoryRow(
    val id: String = randomId(),
    val name: String,
    val created: Long = OffsetDateTime.now().toEpochSecond()
)
