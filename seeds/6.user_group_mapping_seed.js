const knex = require("../knex");
const crypto = require("crypto");

exports.seed = async function () {
    let tableName = "user_group_mapping";
    let query = knex("users").where('isdeleted', 1);
    let users = await query

    for (let index = 0; index < users.length; index++) {
        let query = knex("group").where("type", users[index].group_type).first();
        let results = await query;

        let checkQuery = knex(tableName).where("user_id", users[index].id).andWhere('group_id', results.id);
        let checkedResult = await checkQuery;
        if (checkedResult.length) {
            console.log(`Data already exist in ${tableName} table`);
        }
        else {
            await knex
                .insert({
                    id: crypto.randomUUID(),
                    user_id: users[index].id,
                    group_id: results.id
                })
                .into(tableName)
                .then((res) => {
                    console.log(res, "Done");
                });
        }
    }
};