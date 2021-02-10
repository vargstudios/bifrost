package no.vargstudios.bifrost.worker.job

import io.quarkus.scheduler.Scheduled
import io.quarkus.scheduler.Scheduled.ConcurrentExecution.SKIP
import no.vargstudios.bifrost.server.api.WorkerApi
import no.vargstudios.bifrost.server.api.model.RegisterWorker
import org.eclipse.microprofile.config.inject.ConfigProperty
import org.eclipse.microprofile.rest.client.inject.RestClient
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class RegistrationJob(
    @RestClient val workerApi: WorkerApi,
    @ConfigProperty(name = "worker.name") val workerName: String,
    @ConfigProperty(name = "worker.port") val workerPort: Int,
    @ConfigProperty(name = "server.url") val serverUrl: String
) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    @Scheduled(every = "60s", concurrentExecution = SKIP)
    fun register() {
        try {
            workerApi.registerWorker(RegisterWorker(workerName, workerPort))
            logger.info("Successfully registered with $serverUrl")
        } catch (e: Exception) {
            logger.warn("Failed to register with $serverUrl: ${e.message}")
        }
    }
}
