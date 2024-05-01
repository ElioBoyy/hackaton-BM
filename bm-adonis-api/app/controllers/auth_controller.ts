import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  static async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      token: token,
      ...user.serialize(),
    })
  }
  static async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)

    return response.created({
      token: token,
      ...user.serialize(),
    })
  }
  static async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier

    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }

    await User.accessTokens.delete(user, token)

    return response.ok({ message: 'Logged out' })
  }
}
