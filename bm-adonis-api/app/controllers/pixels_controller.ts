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

    public static async pixelByGridShow({ response, params }: HttpContext) {
        const first = await Pixel.query().where('grid_id', params.gridId).first()
        if (!first) {
            return response.ok([])
        }
        const pixels = await Pixel.query().where('grid_id', params.gridId).exec()
        if (!pixels || pixels.length === 0) {
            return response.notFound()
        }
    
        const uniquePixels = pixels.reduce((acc: { [key: string]: Pixel }, pixel) => {
            const key = `${pixel.x}-${pixel.y}`
            if (!acc[key]) {
                acc[key] = pixel
            }
            return acc
        }, {})
    
        const uniquePixelsArray = Object.values(uniquePixels);
    
        return response.ok(uniquePixelsArray);
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

    public static async destroyByGridXY({ response, params}: HttpContext) {
        const pixel = await Pixel.query().where('grid_id', params.gridId).where('x', params.x).where('y', params.y).first()
        if (!pixel) {
            return response.notFound()
        }
        await pixel.delete()
        return response.ok('Pixel deleted')
    }
}