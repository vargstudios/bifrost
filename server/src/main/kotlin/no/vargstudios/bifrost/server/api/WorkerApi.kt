package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.RegisterWorker
import no.vargstudios.bifrost.server.api.model.Worker
import no.vargstudios.bifrost.server.api.model.WorkerState.NEW
import no.vargstudios.bifrost.worker.registry.WorkerPool
import org.jboss.resteasy.spi.HttpRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.ws.rs.*
import javax.ws.rs.core.Context
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1/workers")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class WorkerApi(val workerPool: WorkerPool) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    @POST
    fun registerWorker(@Context request: HttpRequest, registerWorker: RegisterWorker) {
        val worker = Worker(
            url = "http://${request.remoteAddress}:${registerWorker.port}",
            ip = request.remoteAddress,
            port = registerWorker.port,
            name = registerWorker.name,
            enabled = false,
            state = NEW
        )
        workerPool.addWorker(worker)
    }

    @GET
    fun listWorkers(): List<Worker> {
        return workerPool.listWorkers()
    }

    @POST
    @Path("/{id}/enable")
    fun enableWorker(@PathParam("id") id: String) {
        workerPool.updateWorker(id) { worker ->
            worker.copy(enabled = true)
        }
    }

    @POST
    @Path("/{id}/disable")
    fun disableWorker(@PathParam("id") id: String) {
        workerPool.updateWorker(id) { worker ->
            worker.copy(enabled = false)
        }
    }

}
