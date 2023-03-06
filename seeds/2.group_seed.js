const knex = require("../knex");
const crypto = require("crypto");

exports.seed = async function () {
  let tableName = "group";
  let rows = [
    {
      id: crypto.randomUUID(),
      type: 1,
      name: "Super Admin",
    },
    {
      id: crypto.randomUUID(),
      type: 2,
      name: "Admin",
    },
  ];

  for (let index = 0; index < rows.length; index++) {
    let query = knex(tableName)
      .where("type", rows[index].type)
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
