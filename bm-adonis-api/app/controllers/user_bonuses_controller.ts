import UserBonus from '#models/user_bonus'
import type { HttpContext } from '@adonisjs/core/http'
import { createUserBonusValidator } from '#validators/user_bonus'

export default class UserBonusesController {
  static async index({ response }: HttpContext) {
    const userBonuses = await UserBonus.all()
    return response.ok(userBonuses)
  }

  static async show({ response, params }: HttpContext) {
    const userBonus = await UserBonus.findOrFail(params.id)
    if (!userBonus) {
      return response.notFound()
    }
    return response.ok(userBonus)
  }

  static async store({ request, response }: HttpContext) {
    const userBonus = new UserBonus()
    userBonus.userId = request.input('userId')
    userBonus.bonusId = request.input('bonusId')
    userBonus.gridId = request.input('gridId')

    // Payload validator
    const userBonusPayload = await createUserBonusValidator.validate(userBonus)
    if (userBonusPayload instanceof Error) {
      return response.badRequest(userBonusPayload.message)
    }

    userBonus.save()
    return response.created(userBonus)
  }

  static async destroy({ response, params }: HttpContext) {
    const userBonus = await UserBonus.findOrFail(params.id)
    if (!userBonus) {
      return response.notFound()
    }
    await userBonus.delete()
    return response.ok('User bonus deleted')
  }
}
