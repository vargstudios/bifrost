package no.vargstudios.bifrost.server.util

import org.junit.jupiter.api.Test

internal class IdUtilsTest {

    @Test
    fun test_randomId() {
        val id = randomId()
        println(id)
    }
}
