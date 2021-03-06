package no.vargstudios.bifrost.server.db.model

import no.vargstudios.bifrost.server.util.randomId
import java.time.OffsetDateTime

data class ElementRow(
    val id: String = randomId(),
    val categoryId: String,
    val name: String,
    val framecount: Int,
    val framerate: Int,
    val channels: String,
    val alpha: Boolean,
    val previews: Boolean = false,
    val created: Long = OffsetDateTime.now().toEpochSecond()
)
