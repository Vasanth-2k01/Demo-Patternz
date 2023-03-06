const knex = require("../knex");

exports.up = function () {
    return knex.schema.createTable("master_permissions", function (table) {
        table.uuid("id").primary();
        table.string("name", 255).notNullable();
        table.increments("type");
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.integer("is_deleted").defaultTo(1);
    });
};

exports.down = function () {
    return knex.schema.dropTable("master_permissions");
};
