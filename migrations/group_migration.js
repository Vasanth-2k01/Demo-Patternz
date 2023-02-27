const knex = require("../knex");

exports.up = function () {
  return knex.schema.createTable("group", function (table) {
    table.uuid("id").primary();
    table.string("name", 255).notNullable();
    table.integer("type");
    table.integer("status").defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function () {
  return knex.schema.dropTable("group");
};
