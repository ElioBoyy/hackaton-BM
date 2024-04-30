import vine from '@vinejs/vine'

export const createGridValidator = vine.compile(
  vine.object({
    userId: vine.number().min(1),
    title: vine.string().minLength(5).maxLength(254),
    gridDuration: vine.number().min(1).max(12),
  })
)

export const updateTitleGridValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(5).maxLength(254),
  })
)
