import vine from '@vinejs/vine'

export const createPixelHistoryValidator = vine.compile(
    vine.object({
        gridId: vine.number().min(1),
        x: vine.number().min(0).max(39),
        y: vine.number().min(0).max(39),
        color: vine.string().fixedLength(7)
    })
)