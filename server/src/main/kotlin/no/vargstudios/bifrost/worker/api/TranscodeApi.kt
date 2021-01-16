package no.vargstudios.bifrost.worker.api

import no.vargstudios.bifrost.worker.api.model.Image
import no.vargstudios.bifrost.worker.api.model.TranscodeImagesRequest
import no.vargstudios.bifrost.worker.api.model.TranscodeVideoRequest
import javax.ws.rs.Consumes
import javax.ws.rs.POST
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.core.MediaType

@Path("/api/v1/transcode")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
interface TranscodeApi {

    @POST
    @Path("/images")
    fun transcodeImages(request: TranscodeImagesRequest): List<Image>

    @POST
    @Path("/video")
    @Produces("video/mp4")
    fun transcodeVideo(request: TranscodeVideoRequest): ByteArray
}
