package no.vargstudios.bifrost.worker.registry

import no.vargstudios.bifrost.worker.api.PingApi
import no.vargstudios.bifrost.worker.api.TranscodeApi

data class Worker(
    val url: String,
    val pingApi: PingApi,
    val transcodeApi: TranscodeApi
)
