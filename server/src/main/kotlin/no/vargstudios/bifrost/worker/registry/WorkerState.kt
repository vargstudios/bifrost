package no.vargstudios.bifrost.worker.registry

enum class WorkerState {
    NEW,
    UNREACHABLE,
    IDLE,
    BUSY
}
