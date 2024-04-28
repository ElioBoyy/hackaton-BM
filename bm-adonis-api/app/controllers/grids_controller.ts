import Grid from '#models/grid'
import type { HttpContext } from '@adonisjs/core/http'
import {
    createGridValidator,
    updateTitleGridValidator,
    updateStatusGridValidator
  } from '#validators/grid'
import User from '#models/user'

export default class GridsController {
    public static async index({ response }: HttpContext) {
        const grids = await Grid.all()
        return response.ok(grids)
    }

    public static async show({ response, params }: HttpContext) {
        const grid = await Grid.findOrFail(params.id)
        if (!grid) {
            return response.notFound()
        }
        return response.ok(grid)
    }

    public static async showGridOwner({ response, params }: HttpContext) {
        const user = await User.findOrFail(params.id)
        if (!user) {
            return response.notFound()
        }
        const username = user.$attributes.username
        return response.ok(username)
    }

    public static async store({ request, response }: HttpContext) {
        const grid = new Grid()
        grid.title = request.input('title')
        grid.gridDuration = request.input('grid_duration')
        grid.userId = request.input('user_id')

        // Payload validator
        const grid_payload = await createGridValidator.validate(grid)
        if (grid_payload instanceof Error) {
            return response.badRequest(grid_payload.message)
        }

        await grid.save()
        return response.created(grid)
    }

    public static async updateTitle({ request, response, params }: HttpContext) {
        const grid = await Grid.findOrFail(params.id)
        if (!grid) {
            return response.notFound()
        }
        grid.title = request.input('title')

        // Payload validator
        const grid_payload = await updateTitleGridValidator.validate(grid)
        if (grid_payload instanceof Error) {
            return response.badRequest(grid_payload.message)
        }

        await grid.save()
        return response.ok(grid)
    }

    public static async updateStatus({ request, response, params }: HttpContext) {
        const grid = await Grid.findOrFail(params.id)
        if (!grid) {
            return response.notFound()
        }
        grid.isActive = request.input('is_active')

        // Payload validator
        const grid_payload = await updateStatusGridValidator.validate(grid)
        if (grid_payload instanceof Error) {
            return response.badRequest(grid_payload.message)
        }

        await grid.save()
        return response.ok(grid)
    }

    public static async destroy({ response, params }: HttpContext) {
        const grid = await Grid.findOrFail(params.id)
        if (!grid) {
            return response.notFound()
        }
        await grid.delete()
        return response.ok('Grid deleted')
    }
}