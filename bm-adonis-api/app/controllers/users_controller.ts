import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { updateUserValidator } from '#validators/user'

export default class UsersController {
  static async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  static async show({ response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    if (!user) {
      return response.notFound()
    }
    return response.ok(user)
  }

  static async isUsernameExists({ response, params }: HttpContext) {
    const user = await User.findBy('username', params.username)
    if (user) {
      return response.ok(true)
    }
    return response.ok(false)
  }
  static async isEmailExists({ response, params }: HttpContext) {
    const user = await User.findBy('email', params.email)
    if (user) {
      return response.ok(true)
    }
    return response.ok(false)
  }

  static async update({ request, response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    if (!user) {
      return response.notFound()
    }
    user.username = request.input('username')
    user.email = request.input('email')
    if (request.input('password')) {
      user.password = request.input('password')
    }

    // Payload validator
    const userPayload = await updateUserValidator.validate(user)
    if (userPayload instanceof Error) {
      return response.notModified(userPayload.message)
    }

    // Check if user name or email already exists
    const existingUserName = await User.findBy('username', user.username)
    const existingEmail = await User.findBy('email', user.email)
    if (existingUserName && user.username !== user.$original.username) {
      return response.notModified('User name already taken.')
    }
    if (existingEmail && user.email !== user.$original.email) {
      return response.notModified('Email already taken.')
    }

    user.save()
    return response.ok(user)
  }

  static async destroy({ response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    if (!user) {
      return response.notFound()
    }
    await user.delete()
    return response.ok('User deleted.')
  }

  // Utils
  static async findByEmail({ response, params }: HttpContext) {
    const user = await User.findBy('email', params.email)
    if (!user) {
      return response.notFound('Nobody found with this email address.')
    }
    return response.ok(user)
  }
  static async findByUserName({ response, params }: HttpContext) {
    const user = await User.findBy('username', params.userName)
    if (!user) {
      return response.notFound('Nobody found with this user name.')
    }
    return response.ok(user)
  }
}
