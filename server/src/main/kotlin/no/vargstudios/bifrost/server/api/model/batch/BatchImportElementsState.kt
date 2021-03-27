package no.vargstudios.bifrost.server.api.model.batch

sealed class BatchImportElementsState {
    data class Scanning(
        val type: String = "Scanning"
    ) : BatchImportElementsState()

    data class Scanned(
        val type: String = "Scanned",
        val scanned: List<BatchScannedElement>,
        val time: Long
    ) : BatchImportElementsState()

    data class Importing(
        val type: String = "Importing",
        val scanned: List<BatchScannedElement>,
        val items: List<BatchImportElementItem>
    ) : BatchImportElementsState()

    data class Imported(
        val type: String = "Imported",
        val scanned: List<BatchScannedElement>,
        val items: List<BatchImportElementItem>,
        val time: Long
    ) : BatchImportElementsState()
}
