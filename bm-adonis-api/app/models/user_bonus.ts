import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'

export default class UserBonus extends BaseModel {
  @beforeCreate()
  static async createdAt(userBonus: UserBonus) {
    if (!userBonus.usedAt) {
      userBonus.usedAt = DateTime.now().toString()
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare bonusId: number

  @column()
  declare gridId: number

  @column()
  declare usedAt: String
}
