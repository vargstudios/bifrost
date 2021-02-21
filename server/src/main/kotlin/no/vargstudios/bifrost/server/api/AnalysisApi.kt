package no.vargstudios.bifrost.server.api

import no.vargstudios.bifrost.server.api.model.ExrAnalysis
import no.vargstudios.bifrost.server.exr.ExrAttributeParser
import javax.ws.rs.*
import javax.ws.rs.core.MediaType.APPLICATION_JSON

@Path("/api/v1/analysis")
@Consumes(APPLICATION_JSON)
@Produces(APPLICATION_JSON)
class AnalysisApi {

    @POST
    @Path("/exr")
    @Consumes("image/x-exr")
    fun analyseExr(data: ByteArray): ExrAnalysis {
        try {
            val attributes = ExrAttributeParser(data).parse()
            return ExrAnalysis(
                width = attributes.displayWindow.width,
                height = attributes.displayWindow.height,
                framerate = attributes.framesPerSecond?.toFloat() ?: 24.0F,
                channels = attributes.channels.reversed().joinToString("") { it.name },
                alpha = attributes.channels.any { it.name == "A" }
            )
        } catch (e: Exception) {
            throw BadRequestException("Invalid OpenEXR", e)
        }
    }

}
