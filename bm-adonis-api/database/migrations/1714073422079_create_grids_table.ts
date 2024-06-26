import { BaseSchema } from '@adonisjs/lucid/schema'

export default class GridsSchema extends BaseSchema {
  protected tableName = 'grids'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().primary()
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('url', 254).notNullable().unique()
      table.string('title', 254).notNullable()
      table.integer('grid_duration').notNullable()
      table.integer('is_active').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
