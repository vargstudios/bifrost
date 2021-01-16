package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.worker.registry.WorkerPool
import org.jboss.resteasy.spi.HttpRequest
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.ws.rs.Consumes
import javax.ws.rs.POST
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.Context
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1/workers")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class WorkerApi(val workerPool: WorkerPool) {

    val logger: Logger = LoggerFactory.getLogger(this::class.java)

    @POST
    @Path("/register")
    fun register(@Context request: HttpRequest) {
        logger.info("Worker registration from ${request.remoteAddress}")
        workerPool.addWorker("http://${request.remoteAddress}:3201")
    }

}
