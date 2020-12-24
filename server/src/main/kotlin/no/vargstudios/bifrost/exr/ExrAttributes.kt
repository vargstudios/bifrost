package no.vargstudios.bifrost.exr

data class ExrAttributes(
        val channels: List<Channel>,
        val compression: Compression,
        val dataWindow: Box2i,
        val displayWindow: Box2i,
        val lineOrder: LineOrder,
        val pixelAspectRatio: Float,
        val screenWindowCenter: V2f,
        val screenWindowWidth: Float,
        val framesPerSecond: Rational?
)