package no.vargstudios.bifrost.db.model

import no.vargstudios.bifrost.util.randomId
import java.time.OffsetDateTime

data class ElementCategoryRow(
        val id: String = randomId(),
        val name: String,
        val created: Long = OffsetDateTime.now().toEpochSecond()
)
