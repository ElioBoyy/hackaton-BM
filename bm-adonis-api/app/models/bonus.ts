import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Bonus extends BaseModel {
  @beforeCreate()
  static async createdAt(bonus: Bonus) {
    if (!bonus.createdAt) {
      bonus.createdAt = DateTime.now().toString()
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare createdAt: String
}
