package no.vargstudios.bifrost.server.config

import no.vargstudios.bifrost.server.api.model.Error
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.ws.rs.WebApplicationException
import javax.ws.rs.core.Response
import javax.ws.rs.core.Response.Status.Family.CLIENT_ERROR
import javax.ws.rs.core.Response.Status.INTERNAL_SERVER_ERROR
import javax.ws.rs.core.Response.StatusType
import javax.ws.rs.ext.ExceptionMapper
import javax.ws.rs.ext.Provider

@Provider
class DefaultExceptionMapper : ExceptionMapper<RuntimeException> {

    private val logger: Logger = LoggerFactory.getLogger(this::class.java)

    override fun toResponse(e: RuntimeException): Response {
        val status = getStatus(e)
        val error = Error(
            code = status.statusCode,
            reason = status.reasonPhrase,
            details = e.message ?: "Unknown error"
        )
        if (status.family == CLIENT_ERROR) {
            logger.warn("$error")
        } else {
            logger.error("$error", e)
        }
        return Response.status(status).entity(error).build()
    }

    private fun getStatus(e: Exception): StatusType =
        if (e is WebApplicationException) {
            e.response.statusInfo
        } else {
            INTERNAL_SERVER_ERROR
        }

}
