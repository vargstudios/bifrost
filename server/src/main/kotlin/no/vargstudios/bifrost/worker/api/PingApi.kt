package no.vargstudios.bifrost.worker.api

import javax.ws.rs.Consumes
import javax.ws.rs.POST
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
interface PingApi {

    @POST
    @Path("/ping")
    fun ping(): String
}
