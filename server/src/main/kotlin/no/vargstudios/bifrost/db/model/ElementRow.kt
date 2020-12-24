package no.vargstudios.bifrost.db.model

import no.vargstudios.bifrost.util.randomId
import java.time.OffsetDateTime

data class ElementRow(
        val id: String = randomId(),
        val categoryId: String,
        val name: String,
        val framecount: Int,
        val framerate: Int,
        val alpha: Boolean,
        val created: Long = OffsetDateTime.now().toEpochSecond()
)
