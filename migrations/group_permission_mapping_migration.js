const knex = require("../knex");

exports.up = function () {
  return knex.schema.createTable("group_permission_mapping", function (table) {
    table.uuid("id").primary();
    table
      .uuid("group_id")
      .references("id")
      .inTable("group")
    table
      .uuid("parent_menu_id").nullable();
    table
      .uuid("sub_menu_id")
      .references("id")
      .inTable("menus").nullable();
    table
      .uuid("permission_id")
      .references("id")
      .inTable("master_permissions")
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function () {
  return knex.schema.dropTable("group_rule_mapping");
};
