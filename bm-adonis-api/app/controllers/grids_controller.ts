import Grid from '#models/grid'
import type { HttpContext } from '@adonisjs/core/http'
import { createGridValidator, updateTitleGridValidator } from '#validators/grid'
import User from '#models/user'

export default class GridsController {
  static async index({ response }: HttpContext) {
    const grids = await Grid.all()
    return response.ok(grids)
  }

  static async show({ response, params }: HttpContext) {
    const grid = await Grid.findOrFail(params.id)
    if (!grid) {
      return response.notFound()
    }
    return response.ok(grid)
  }

  static async showGridOwner({ response, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    if (!user) {
      return response.notFound()
    }
    const username = user.$attributes.username
    return response.ok(username)
  }

  static async showGridByUrl({ response, params }: HttpContext) {
    const grid = await Grid.findBy('url', params.url)
    if (!grid) {
      return response.notFound()
    }
    return response.ok(grid)
  }

  static async store({ request, response }: HttpContext) {
    const grid = new Grid()
    grid.title = request.input('title')
    grid.gridDuration = request.input('grid_duration')
    grid.userId = request.input('user_id')

    // Payload validator
    const gridPayload = await createGridValidator.validate(grid)
    if (gridPayload instanceof Error) {
      return response.badRequest(gridPayload.message)
    }

    await grid.save()
    return response.created(grid)
  }

  static async updateTitle({ request, response, params }: HttpContext) {
    const grid = await Grid.findOrFail(params.id)
    if (!grid) {
      return response.notFound()
    }
    grid.title = request.input('title')

    // Payload validator
    const gridPayload = await updateTitleGridValidator.validate(grid)
    if (gridPayload instanceof Error) {
      return response.badRequest(gridPayload.message)
    }

    await grid.save()
    return response.ok(grid)
  }

  static async updateStatus({ response, params }: HttpContext) {
    const grid = await Grid.findOrFail(params.id)
    if (!grid) {
      return response.notFound()
    }

    if (grid.isActive === 1) {
      grid.isActive = 0
    }

    await grid.save()
    return response.ok(grid)
  }

  static async destroy({ response, params }: HttpContext) {
    const grid = await Grid.findOrFail(params.id)
    if (!grid) {
      return response.notFound()
    }
    await grid.delete()
    return response.ok('Grid deleted')
  }
}
