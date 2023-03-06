const knex = require("../knex");

exports.up = function () {
    return knex.schema.createTable("user_group_mapping", function (table) {
        table.uuid("id").primary();
        table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table
            .uuid("group_id")
            .references("id")
            .inTable("group")
            .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

exports.down = function () {
    return knex.schema.dropTable("user_group_mapping");
};
