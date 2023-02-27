const knex = require("../knex");

exports.up = function () {
    return knex.schema.createTable("menus", function (table) {
        table.uuid("id").primary();
        table.uuid("parent_menu_id")
        table.integer("level").notNullable();
        table.string("menu_title", 255).notNullable();
        table.text("master_permissions")
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.integer("is_deleted").defaultTo(1);
    });
};

exports.down = function () {
    return knex.schema.dropTable("menus");
};
