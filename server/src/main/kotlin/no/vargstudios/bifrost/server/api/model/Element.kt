package no.vargstudios.bifrost.server.api.model

data class Element(
    val id: String,
    val name: String,
    val framecount: Int,
    val framerate: Int,
    val alpha: Boolean,
    val previews: Boolean,
    val versions: List<ElementVersion>,
    val category: ElementCategory
)
