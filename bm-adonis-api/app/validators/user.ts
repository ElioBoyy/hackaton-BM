import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(5)
      .maxLength(50)
      .unique(async (query, field) => {
        const user = await query.from('users').where('username', field).first()
        return !user
      }),
    email: vine
      .string()
      .email()
      .toLowerCase()
      .unique(async (query, field) => {
        const user = await query.from('users').where('email', field).first()
        return !user
      }),
  })
)
