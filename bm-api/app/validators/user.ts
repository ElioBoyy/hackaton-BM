import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(5).maxLength(50),
        email: vine.string().email().toLowerCase(),
        password: vine.string().minLength(12)
    })
)

export const updateUserValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(5).maxLength(50),
        email: vine.string().email().toLowerCase(),
        password: vine.string().minLength(12)
    })
)