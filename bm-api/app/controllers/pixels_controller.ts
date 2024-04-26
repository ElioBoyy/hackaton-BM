import Pixel from '#models/pixel'
import type { HttpContext } from '@adonisjs/core/http'
import { createPixelValidator } from '#validators/pixel'

export default class PixelsController {
    public static async index({ response }: HttpContext) {
        const pixels = await Pixel.all()
        return response.ok(pixels)
    }

    public static async show({ response, params }: HttpContext) {
        const pixel = await Pixel.findOrFail(params.id)
        if (!pixel) {
            return response.notFound()
        }
        return response.ok(pixel)
    }

    public static async store({ request, response }: HttpContext) {
        const pixel = new Pixel()
        pixel.gridId = request.input('gridId')
        pixel.userId = request.input('userId')
        pixel.x = request.input('x')
        pixel.y = request.input('y')
        pixel.color = request.input('color')

        // Payload validator
        const pixel_payload = await createPixelValidator.validate(pixel)
        if (pixel_payload instanceof Error) {
            return response.badRequest(pixel_payload.message)
        }

        pixel.save()
        return response.created(pixel)
    }

    public static async destroy({ response, params}: HttpContext) {
        const pixel = await Pixel.findOrFail(params.id)
        if (!pixel) {
            return response.notFound()
        }
        await pixel.delete()
        return response.ok('Pixel deleted')
    }
}