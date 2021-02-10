package no.vargstudios.bifrost.worker.registry

import no.vargstudios.bifrost.server.api.model.Worker

typealias WorkerTask = (Worker, WorkerApis) -> Unit
