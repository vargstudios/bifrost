package no.vargstudios.bifrost.server.util

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test

internal class FilenameUtilsKtTest {

    @Test
    fun `parseFilename() returns null when invalid format`() {
        assertNull(parseFilename(""))
    }

    @Test
    fun `parseFilename() handles sequence after hyphen`() {
        assertEquals(
            Filename(name = "Fire", sequence = 3, extension = "exr"),
            parseFilename("Fire-003.exr")
        )
    }

    @Test
    fun `parseFilename() handles sequence after underscore`() {
        assertEquals(
            Filename(name = "Bloody_Axe", sequence = 17, extension = "exr"),
            parseFilename("Bloody_Axe_0017.exr")
        )
    }

    @Test
    fun `parseFilename() handles sequence after dot`() {
        assertEquals(
            Filename(name = "Water-Droplets", sequence = 1017, extension = "jpg"),
            parseFilename("Water-Droplets.01017.jpg")
        )
    }
}
