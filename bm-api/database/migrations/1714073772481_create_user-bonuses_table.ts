import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user-bonuses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('bonus_id').unsigned().references('bonuses.id').onDelete('CASCADE')

      table.timestamp('used_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}