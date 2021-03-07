package no.vargstudios.bifrost.server.service.model

import java.io.File

data class ExrSequence(
    val name: String,
    val consecutive: Boolean,
    val files: List<File>
)
