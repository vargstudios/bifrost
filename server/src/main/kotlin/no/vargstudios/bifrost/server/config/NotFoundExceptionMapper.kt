package no.vargstudios.bifrost.server.config

import javax.ws.rs.NotFoundException
import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper
import javax.ws.rs.ext.Provider

@Provider
class NotFoundExceptionMapper : ExceptionMapper<NotFoundException> {

    override fun toResponse(e: NotFoundException): Response {
        return DefaultExceptionMapper().toResponse(e)
    }

}
