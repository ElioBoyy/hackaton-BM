import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PixelHistory extends BaseModel {
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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}