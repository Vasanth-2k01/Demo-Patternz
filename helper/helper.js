var knex = require("../knex");
const dotenv = require("dotenv").config();

module.exports = {
    isHavePermission: (menu, permission) => {
        return async (req, res, next) => {
            console.log('isHavePermission', req.userid, 'req.userid', menu, 'menu', permission, 'permission');
        }
    }
}