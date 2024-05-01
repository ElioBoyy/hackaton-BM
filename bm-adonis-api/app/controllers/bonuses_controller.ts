import Bonus from '#models/bonus'
import { createBonusValidator } from '#validators/bonus'
import type { HttpContext } from '@adonisjs/core/http'

export default class BonusesController {
  static async index({ response }: HttpContext) {
    const bonuses = await Bonus.all()
    return response.ok(bonuses)
  }

  static async show({ response, params }: HttpContext) {
    const bonus = await Bonus.findOrFail(params.id)
    if (!bonus) {
      return response.notFound()
    }
    return response.ok(bonus)
  }

  static async store({ request, response }: HttpContext) {
    const bonus = new Bonus()
    bonus.name = request.input('name')

    // Payload validator
    const bonusPayload = await createBonusValidator.validate(bonus)
    if (bonusPayload instanceof Error) {
      return response.badRequest(bonusPayload.message)
    }

    bonus.save()
    return response.created(bonus)
  }

  static async destroy({ response, params }: HttpContext) {
    const bonus = await Bonus.findOrFail(params.id)
    if (!bonus) {
      return response.notFound()
    }
    await bonus.delete()
    return response.ok('Bonus deleted')
  }
}
