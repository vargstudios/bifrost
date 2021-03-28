package no.vargstudios.bifrost.server.db.model

fun List<ElementVersionRow>.version(name: String): ElementVersionRow {
    return this.find { it.name == name } ?: throw IllegalStateException("Version '$name' not found")
}

fun List<ElementVersionRow>.exceptVersion(name: String): List<ElementVersionRow> {
    return this.filter { it.name != name }
}
