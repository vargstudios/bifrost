package no.vargstudios.bifrost.util

import kotlin.random.Random

// Crockford's Base32
const val base32 = "0123456789abcdefghjkmnpqrstvwxyz"

// Equivalently unique and url safe as a UUID, but only 24 chars
fun randomId(): String {
    return Random.nextBytes(24)
            .map { base32[(it.toInt() + 256) % base32.length] }
            .joinToString("")
}
