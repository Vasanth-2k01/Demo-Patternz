const knex = require("../knex");

exports.up = function () {
    return knex.schema
        .createTable("users", function (table) {
            table.uuid("id").primary();
            table.integer("group_type").notNullable();
            table.string("name", 255).notNullable();
            table.string("surname", 255).notNullable();
            table.string("email", 255).notNullable();
            table.string("password", 255).notNullable();
            table.string("image", 500).nullable();
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.integer("isdeleted").defaultTo(1);
        })
};

exports.down = function () {
    return knex.schema
        .dropTable("users")
};
