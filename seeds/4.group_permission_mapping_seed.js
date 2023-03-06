const knex = require("../knex");
const crypto = require("crypto");

exports.seed = async function () {
  let tableName = "group_permission_mapping";

  let group = await knex.select('id').from("group").where('type', 1).first()
  // console.log(group, "Super Admin - group");

  let third_level_menu = await knex.select('*').from("menus").where('level', 3)
  // console.log(third_level_menu, "third_level_menu"); 

  for (let i = 0; i < third_level_menu.length; i++) {
    let permission = null
    permission = JSON.parse(third_level_menu[i].master_permissions)
    if (permission && permission.length) {
      for (let j = 0; j < permission.length; j++) {
        let query = knex(tableName).where('group_id', group.id)
          .andWhere('parent_menu_id', third_level_menu[i].parent_menu_id)
          .andWhere('sub_menu_id', third_level_menu[i].id,)
          .andWhere('permission_id', permission[j])
        let results = await query
        if (results.length) {
          console.log(`Data already exist in ${tableName} table`);
        } else {
          console.log(permission[j], ' permission[j]');
          await knex
            .insert({
              id: crypto.randomUUID(),
              group_id: group.id,
              parent_menu_id: third_level_menu[i].parent_menu_id,
              sub_menu_id: third_level_menu[i].id,
              permission_id: permission[j],
            })
            .into(tableName)
        }
      }
    } else {
      console.log("No Permission For this Menu");
    }
  }
};
