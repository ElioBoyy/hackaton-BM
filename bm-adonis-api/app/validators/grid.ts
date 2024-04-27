import vine from '@vinejs/vine'

export const createGridValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(5).maxLength(254)
    })
)

export const updateTitleGridValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(5).maxLength(254)
    })
)

export const updateStatusGridValidator = vine.compile(
    vine.object({
        isActive: vine.number().max(1).min(0)
    })
)