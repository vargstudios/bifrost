package no.vargstudios.bifrost.api.model

data class CreateElement(
        val categoryId: String,
        val name: String,
        val framecount: Int,
        val framerate: Int,
        // From analysis:
        val width: Int,
        val height: Int,
        val alpha: Boolean
)
