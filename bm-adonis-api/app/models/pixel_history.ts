import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export default class PixelHistory extends BaseModel {
  @beforeCreate()
  static async createdAt(pixelHistory: PixelHistory) {
    if (!pixelHistory.createdAt) {
      pixelHistory.createdAt = DateTime.now().toString()
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare gridId: number

  @column()
  declare x: number

  @column()
  declare y: number

  @column()
  declare color: string

  @column()
  declare createdAt: String
}
