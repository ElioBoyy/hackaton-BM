import vine from '@vinejs/vine'

export const createBonusValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(2).maxLength(32)
    })
)