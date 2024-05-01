import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pixels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.integer('grid_id').unsigned().references('grids.id').onDelete('CASCADE')
      // pas de référence à user.username car modifiable et moins de perfs sur la DB
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.integer('x').notNullable()
      table.integer('y').notNullable()
      table.string('color', 7).notNullable()

      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
