package no.vargstudios.bifrost.server.exr

import java.lang.Float.intBitsToFloat

class ExrAttributeParser(private val bytes: ByteArray) {
    private var pos = 0

    fun parse(): ExrAttributes {
        // Magic number
        val magicNumber = parseInt()
        if (magicNumber != 20000630) {
            throw IllegalArgumentException("Not OpenEXR")
        }
        check(magicNumber == 20000630)

        // Version
        val version = next()
        if (version > 2) {
            throw IllegalArgumentException("Unsupported OpenEXR version $version")
        }
        skip(3) // TODO: flags

        // Headers
        val attributes = mutableMapOf<String, Any>()
        while (peek() > 0) {
            val (name, value) = parseAttribute()
            attributes[name] = value
        }
        skip(1)

        return ExrAttributes(
            channels = find(attributes, "channels"),
            compression = find(attributes, "compression"),
            dataWindow = find(attributes, "dataWindow"),
            displayWindow = find(attributes, "displayWindow"),
            lineOrder = find(attributes, "lineOrder"),
            pixelAspectRatio = find(attributes, "pixelAspectRatio"),
            screenWindowCenter = find(attributes, "screenWindowCenter"),
            screenWindowWidth = find(attributes, "screenWindowWidth"),
            // TODO: more non-standard attributes?
            framesPerSecond = find(attributes, "framesPerSecond")
        )
    }

    private inline fun <reified T> find(attributes: Map<String, Any>, name: String): T {
        return when (val value = attributes[name]) {
            is T -> value
            null -> throw IllegalArgumentException("Missing attribute '$name'")
            else -> throw IllegalArgumentException("Invalid attribute '$name'")
        }
    }

    private fun parseAttribute(): Pair<String, Any> {
        val name = parseString()
        val type = parseString()
        val size = parseInt()
        val value = parseAttributeValue(type, size)
        return Pair(name, value)
    }

    private fun parseAttributeValue(type: String, size: Int): Any {
        return when (type) {
            "int" -> parseInt()
            "string" -> parseString(size)
            "float" -> parseFloat()
            "rational" -> parseRational()
            "chlist" -> parseChannels()
            "compression" -> parseCompression()
            "lineOrder" -> parseLineOrder()
            "box2i" -> parseBox2i()
            "box2f" -> parseBox2f()
            "v2i" -> parseV2i()
            "v2f" -> parseV2f()
            "v3i" -> parseV3i()
            "v3f" -> parseV3f()
            else -> skip(size)
        }
    }

    // Multi-value parsers

    private fun parseChannels(): List<Channel> {
        val channels = mutableListOf<Channel>()
        while (peek() > 0) {
            channels.add(parseChannel())
        }
        skip(1)
        return channels
    }

    private fun parseChannel(): Channel {
        return Channel(parseString(), parsePixelType(), parseInt() and 0xff > 0, parseInt(), parseInt())
    }

    private fun parseRational(): Rational {
        return Rational(parseInt(), parseInt())
    }

    private fun parseBox2i(): Box2i {
        return Box2i(parseInt(), parseInt(), parseInt(), parseInt())
    }

    private fun parseBox2f(): Box2f {
        return Box2f(parseFloat(), parseFloat(), parseFloat(), parseFloat())
    }

    private fun parseV2f(): V2f {
        return V2f(parseFloat(), parseFloat())
    }

    private fun parseV2i(): V2i {
        return V2i(parseInt(), parseInt())
    }

    private fun parseV3i(): V3i {
        return V3i(parseInt(), parseInt(), parseInt())
    }

    private fun parseV3f(): V3f {
        return V3f(parseFloat(), parseFloat(), parseFloat())
    }

    // Enum parsers

    private fun parsePixelType(): PixelType = when (parseInt()) {
        0 -> PixelType.UINT
        1 -> PixelType.HALF
        2 -> PixelType.FLOAT
        else -> throw IllegalArgumentException("Unsupported pixel type")
    }

    private fun parseCompression(): Compression = when (next().toInt()) {
        0 -> Compression.NONE
        1 -> Compression.RLE
        2 -> Compression.ZIPS
        3 -> Compression.ZIP
        4 -> Compression.PIZ
        5 -> Compression.PXR24
        6 -> Compression.B44
        7 -> Compression.B44A
        else -> throw IllegalArgumentException("Unsupported compression")
    }

    private fun parseLineOrder(): LineOrder = when (next().toInt()) {
        0 -> LineOrder.INCREASING_Y
        1 -> LineOrder.DECREASING_Y
        2 -> LineOrder.RANDOM_Y
        else -> throw IllegalArgumentException("Unsupported line order")
    }

    // General parsers

    private fun parseInt(): Int {
        if (remaining() < 4) {
            throw IllegalStateException("Unexpected end of file")
        }
        return (next().toInt() and 0xff shl 0) or
                (next().toInt() and 0xff shl 8) or
                (next().toInt() and 0xff shl 16) or
                (next().toInt() and 0xff shl 24)
    }

    private fun parseFloat(): Float {
        return intBitsToFloat(parseInt())
    }

    private fun parseString(n: Int): String {
        if (remaining() < n) {
            throw IllegalStateException("Unexpected end of file")
        }
        val sb = StringBuilder()
        for (i in 0 until n) {
            sb.append(next().toChar())
        }
        return sb.toString()
    }

    private fun parseString(): String {
        val sb = StringBuilder()
        while (peek() > 0) {
            sb.append(next().toChar())
        }
        skip(1)
        return sb.toString()
    }

    // Stream functions

    private fun peek(): Byte {
        return bytes[pos]
    }

    private fun next(): Byte {
        return bytes[pos++]
    }

    private fun skip(n: Int) {
        pos += n
    }

    private fun remaining(): Int {
        return bytes.size - pos
    }
}
