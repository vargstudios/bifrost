package no.vargstudios.bifrost.server.api.model

import no.vargstudios.bifrost.server.util.randomId

data class Worker(
    val id: String = randomId(),
    val url: String,
    val ip: String,
    val port: Int,
    val name: String,
    val enabled: Boolean,
    val state: WorkerState
)
