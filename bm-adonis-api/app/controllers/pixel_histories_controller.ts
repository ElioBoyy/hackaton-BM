import PixelHistory from '#models/pixel_history'
import type { HttpContext } from '@adonisjs/core/http'
import {
    createPixelHistoryValidator
} from '#validators/pixel_history'

export default class PixelHistoriesController {
    public static async index({ response }: HttpContext) {
        const pixelHistory = await PixelHistory.all()
        return response.ok(pixelHistory)
    }

    public static async show({ response, params }: HttpContext) {
        const pixelHistory = await PixelHistory.find(params.id)

        if (!pixelHistory) {
            return 'Pixel history not found'
        }

        return response.ok(pixelHistory)
    }

    public static async store({ response, request }: HttpContext) {
        const pixelHistory = new PixelHistory()
        pixelHistory.gridId = request.input('grid_id')
        pixelHistory.x = request.input('x')
        pixelHistory.y = request.input('y')
        pixelHistory.color = request.input('color')

        const pixelHistoryPayload = await createPixelHistoryValidator.validate(pixelHistory)
        if (pixelHistoryPayload instanceof Error) {
            return pixelHistoryPayload.message
        }

        await pixelHistory.save()
        return response.created(pixelHistory)
    }

    public static async destroy({ response, params }: HttpContext) {
        const pixelHistory = await PixelHistory.find(params.id)

        if (!pixelHistory) {
            return response.notFound()
        }

        await pixelHistory.delete()
        return response.ok('Pixel history deleted')
    }
}