package no.vargstudios.bifrost.worker.registry

import no.vargstudios.bifrost.worker.api.PingApi
import no.vargstudios.bifrost.worker.api.TranscodeApi

data class WorkerApis(
    val url: String,
    val pingApi: PingApi,
    val transcodeApi: TranscodeApi
)
