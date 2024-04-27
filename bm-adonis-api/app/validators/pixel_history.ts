import vine from '@vinejs/vine'

export const createPixelHistoryValidator = vine.compile(
    vine.object({
        pixelId: vine.number().min(1),
        color: vine.string().fixedLength(7)
    })
)