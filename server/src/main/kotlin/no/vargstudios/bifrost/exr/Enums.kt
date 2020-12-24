package no.vargstudios.bifrost.exr

enum class Compression {
    NONE,
    RLE,
    ZIPS,
    ZIP,
    PIZ,
    PXR24,
    B44,
    B44A
}

enum class LineOrder {
    INCREASING_Y,
    DECREASING_Y,
    RANDOM_Y
}

enum class PixelType {
    UINT,
    HALF,
    FLOAT
}