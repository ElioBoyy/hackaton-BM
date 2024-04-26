import vine from '@vinejs/vine'

export const createUserBonusValidator = vine.compile(
    vine.object({
        userId: vine.number().min(1),
        bonusId: vine.number().min(1),
        gridId: vine.number().min(1)
    })
)