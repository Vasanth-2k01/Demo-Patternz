const knex = require("../knex");
const crypto = require("crypto");
const common = require("../common/common");

exports.seed = async function () {
    let tableName = "users";
    rows = [
        {
            id: crypto.randomUUID(),
            group_type: 1,
            name: "Vasanth",
            surname: "M",
            email: "vasanth@gmail.com",
            password: common.encryptPWD('Qwer@123'),
            image: "",
        },
        {
            id: crypto.randomUUID(),
            group_type: 2,
            name: "Narasingam",
            surname: "M",
            email: "narasingam@gmail.com",
            password: common.encryptPWD('Qwer@123'),
            image: "",
        },
        {
            id: crypto.randomUUID(),
            group_type: 3,
            name: "Senthur",
            surname: "M",
            email: "senthur@gmail.com",
            password: common.encryptPWD('Qwer@123'),
            image: "",
        },
    ];
    for (index = 0; index < rows.length; index++) {
        let query = knex(tableName)
            .where("group_type", rows[index].group_type)
            .andWhere("name", rows[index].name.trim())
            .andWhere("surname", rows[index].surname.trim())
            .andWhere("email", rows[index].email.trim())
            .andWhere("password", rows[index].password)

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
