import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column } from '@adonisjs/lucid/orm'

export default class Grid extends BaseModel {
  @beforeSave()
  static async randomizedUrl(grid: Grid) {
    if (!grid.url) {
      grid.url = generateRandomUrl()
    }
  }

  @beforeCreate()
  static async isActive(grid: Grid) {
    if (!grid.isActive) {
      grid.isActive = 1
    }
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare url: string

  @column()
  declare title: string

  @column()
  declare gridDuration: number

  @column()
  declare isActive: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: false })
  declare createdAt: DateTime
}

function generateRandomUrl() {
  const urlSafeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_' // UTF-8 safe chars
  const urlLength = 32
  let url = ''

  for (let i = 0; i < urlLength; i++) {
    const randomIndex = Math.floor(Math.random() * urlSafeChars.length)
    url += urlSafeChars[randomIndex]
  }

  return url
}
