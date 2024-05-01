import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export default class Pixel extends BaseModel {
  @beforeCreate()
  static async createdAt(pixel: Pixel) {
    if (!pixel.createdAt) {
      pixel.createdAt = DateTime.now().toString()
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gridId: number

  @column()
  declare userId: number

  @column()
  declare x: number

  @column()
  declare y: number

  @column()
  declare color: string

  @column()
  declare createdAt: String
}
