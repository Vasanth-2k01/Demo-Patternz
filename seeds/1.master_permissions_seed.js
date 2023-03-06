const knex = require("../knex");
const crypto = require("crypto");

exports.seed = async function () {
    let tableName = "master_permissions";
    let rows = [
        {
            id: crypto.randomUUID(),
            name: "Add",
        },
        {
            id: crypto.randomUUID(),
            name: "Edit",
        },
        {
            id: crypto.randomUUID(),
            name: "List",
        }, {
            id: crypto.randomUUID(),
            name: "Delete",
        },
    ];

    for (let index = 0; index < rows.length; index++) {
        let query = knex(tableName)
            .where("name", rows[index].name.trim());
        let results = await query;
        if (results.length) {
            console.log(`Data already exist in ${tableName} table`);
        } else {
            await knex
                .insert(rows[index])
                .into(tableName)
                .then((res) => {
                    console.log(res, "Done");
                });
        }
    }
};
