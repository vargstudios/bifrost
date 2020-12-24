package no.vargstudios.bifrost.exr

data class Channel(
        val name: String,
        val pixelType: PixelType,
        val linear: Boolean,
        val xSampling: Int,
        val ySampling: Int
)

data class Rational(val numerator: Int, val denominator: Int) {
    fun toFloat(): Float {
        return numerator.toFloat() / denominator.toFloat()
    }
}

data class Box2i(val xMin: Int, val yMin: Int, val xMax: Int, val yMax: Int) {
    val width = (xMax - xMin) + 1
    val height = (yMax - yMin) + 1
}

data class Box2f(val xMin: Float, val yMin: Float, val xMax: Float, val yMax: Float) {
    val width = (xMax - xMin) + 1
    val height = (yMax - yMin) + 1
}

data class V2i(val x: Int, val y: Int)
data class V2f(val x: Float, val y: Float)
data class V3i(val x: Int, val y: Int, val z: Int)
data class V3f(val x: Float, val y: Float, val z: Float)

