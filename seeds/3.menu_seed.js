const knex = require("../knex");
const crypto = require("crypto");
const common = require("../common/common");

exports.seed = async function () {
    tableName = "menus";
    let menu_id = '',
        rows = [
            {
                id: crypto.randomUUID(),
                parent_menu_id: null,
                level: 1,
                menu_title: "Main",
                master_permissions: null,
                menus: [
                    {
                        id: crypto.randomUUID(),
                        parent_menu_id: null,
                        level: 2,
                        menu_title: "Users",
                        master_permissions: null,
                        menus: [
                            {
                                id: crypto.randomUUID(),
                                parent_menu_id: null,
                                level: 3,
                                menu_title: "Super Admin",
                                master_permissions: ['List'],
                            },
                            {
                                id: crypto.randomUUID(),
                                parent_menu_id: null,
                                level: 3,
                                menu_title: "Admin",
                                master_permissions: ['Add', 'Edit', 'Delete', 'List'],
                            }
                        ]
                    }
                ]
            },
        ];
    for (i = 0; i < rows.length; i++) {
        let query = knex(tableName)
            .where("parent_menu_id", rows[i].parent_menu_id)
            .andWhere("level", rows[i].level)
            .andWhere("menu_title", rows[i].menu_title.trim())
        let results = await query;
        if (results.length) {
            console.log(`Data already exist in ${tableName} table`);
        } else {
            await knex
                .insert({
                    id: rows[i].id,
                    parent_menu_id: rows[i].parent_menu_id ? rows[i].parent_menu_id : null,
                    level: rows[i].level,
                    menu_title: rows[i].menu_title,
                    master_permissions: rows[i].master_permissions ? rows[i].master_permissions : null,
                }).returning("id")
                .into(tableName)
                .then(async (res) => {
                    menu_id = await res[0].id
                    console.log(res, "Done", menu_id, 'menu_id');
                });
            console.log(menu_id, 'menu_id');
            if (rows[i].menus && rows[i].menus.length) {
                console.log(menu_id, 'menu_id inside');
                for (let j = 0; j < rows[i].menus.length; j++) {
                    let query = knex(tableName)
                        .where("parent_menu_id", menu_id)
                        .andWhere("level", rows[i].menus[j].level)
                        .andWhere("menu_title", rows[i].menus[j].menu_title.trim())
                    let results = await query;
                    if (results.length) {
                        console.log(`Data already exist in ${tableName} ${rows[i].menus[j].menu_title} table`);
                    } else {
                        await knex
                            .insert({
                                id: rows[i].menus[j].id,
                                parent_menu_id: menu_id ? menu_id : null,
                                level: rows[i].menus[j].level,
                                menu_title: rows[i].menus[j].menu_title,
                                master_permissions: rows[i].menus[j].master_permissions ? rows[i].menus[j].master_permissions : null,
                            }).returning("id")
                            .into(tableName)
                            .then(async (res) => {
                                menu_id = await res[0].id
                                console.log(res, "Done", menu_id, 'menu_id');
                            });
                        if (rows[i].menus[j].menus && rows[i].menus[j].menus.length) {
                            for (let k = 0; k < rows[i].menus[j].menus.length; k++) {
                                let query = knex(tableName)
                                    .where("parent_menu_id", menu_id)
                                    .andWhere("level", rows[i].menus[j].menus[k].level)
                                    .andWhere("menu_title", rows[i].menus[j].menus[k].menu_title.trim())
                                let results = await query;
                                if (results.length) {
                                    console.log(`Data already exist in ${rows[i].menus[j].menus[k].menu_title} table`);
                                } else {
                                    let permissionArray = [];
                                    if (rows[i].menus[j].menus[k].master_permissions && rows[i].menus[j].menus[k].master_permissions.length) {
                                        for (let index = 0; index < rows[i].menus[j].menus[k].master_permissions.length; index++) {
                                            let query = knex.select('id').from('master_permissions').where('name', rows[i].menus[j].menus[k].master_permissions[index]).first()
                                            let results = await query
                                            console.log(results, 'results', rows[i].menus[j].menus[k].menu_title, 'menu_title');
                                            permissionArray.push(results.id)
                                        }
                                    }
                                    let permissionString = JSON.stringify(permissionArray);
                                    console.log(permissionString, 'permissionString');
                                    let query = knex
                                        .insert({
                                            id: rows[i].menus[j].menus[k].id,
                                            parent_menu_id: menu_id ? menu_id : null,
                                            level: rows[i].menus[j].menus[k].level,
                                            menu_title: rows[i].menus[j].menus[k].menu_title,
                                            master_permissions: permissionString
                                        })
                                        .into(tableName)
                                    await query
                                    console.log("Done Inserting", permissionArray, 'permissionArray');
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
