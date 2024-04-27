import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import {
    updateUserValidator
  } from '#validators/user'

export default class UsersController {
    public static async index({ response }: HttpContext) {
        const users = await User.all()
        return response.ok(users)
    }

    public static async show({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        if (!user) {
            return response.notFound()
        }
        return response.ok(user)
    }

    public static async update({ request, response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        if (!user) {
            return response.notFound()
        }
        user.username = request.input('username')
        user.email = request.input('email')
        user.password = request.input('password')

        // Payload validator
        const user_payload = await updateUserValidator.validate(user)
        if (user_payload instanceof Error) {
            return response.notModified(user_payload.message)
        }

        // Check if user name or email already exists
        const existingUserName = await User.findBy('username', user.username)
        const existingEmail = await User.findBy('email', user.email)
        if (existingUserName) {
            return response.notModified('User name already taken.')
        }
        if (existingEmail) {
            return response.notModified('Email already taken.')
        }

        user.save()
        return response.ok(user)
    }

    public static async destroy({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        if (!user) {
            return response.notFound()
        }
        await user.delete()
        return response.ok("User deleted.")
    }

    // Utils
    public static async findByEmail({ response, params }: HttpContext) {
        const user = await User.findBy('email', params.email)
        if (!user) {
            return response.notFound('Nobody found with this email address.')
        }
        return response.ok(user)
    }
    public static async findByUserName({ response, params }: HttpContext) {
        const user = await User.findBy('username', params.userName)
        if (!user) {
            return response.notFound('Nobody found with this user name.')
        }
        return response.ok(user)
    }
}