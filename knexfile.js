require("dotenv").config();
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      database: "Demo Patternz",
      user: "postgres",
      password: "123456",
      charset: "utf8",
      pool: {
        min: 2,
        max: 10,
      },
    },
    migrations: {
      directory: __dirname + "/migrations",
    },
    seeds: {
      directory: __dirname + "/seeds",
    },
  },
};
