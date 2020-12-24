package no.vargstudios.bifrost.util

import org.junit.jupiter.api.Test

class IdUtilsTest {

    @Test
    fun test_randomId() {
        val id = randomId()
        println(id)
    }
}