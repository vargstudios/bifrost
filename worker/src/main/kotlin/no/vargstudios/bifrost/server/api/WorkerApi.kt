package no.vargstudios.bifrost.server.api

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient
import javax.ws.rs.Consumes
import javax.ws.rs.POST
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1/workers")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
@RegisterRestClient(configKey = "server")
interface WorkerApi {

    @POST
    @Path("/register")
    fun register()

}
