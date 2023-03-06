var knex = require("../knex");
var crypto = require("crypto");
var JWT = require("jsonwebtoken");
var fileUpload = require("../common/fileupload");
var common = require("../common/common");
const dotenv = require("dotenv").config();

signToken = user => {
  var JWTEXP = user.expToken == 1 ? (new Date().getTime() + (365 * 24 * 60 * 60 * 1000)) : (new Date().getTime() + 604800 * 1000) / 1000;
  return JWT.sign({
    iss: process.env.JWT_ISS,
    sub: user.id,
    iat: (new Date().getTime() + 60 * 60 * 1000) / 1000,//new Date().getTime(), // current time
    exp: JWTEXP,
  }, process.env.JWT_SECRET);
}
class Users {
  static async UserList() {
    console.log("UserList inside Model");
    try {
      let query = knex(process.env.USERS).where('group_type', 3).andWhere("isdeleted", 1);
      let result = await query;
      if (!result) {
        return {
          success: false,
          message: "No record found",
          data: {},
        };
      }
      return {
        success: true,
        message: "User Listed Successfully",
        data: result.map((obj) => ({
          id: obj.id,
          name: obj.name,
          surname: obj.surname,
          email: obj.email,
          password: common.decryptPWD(obj.password),
          image:
            process.env.ENVIRONMENT_URL + "/" + obj.image ||
            fileUpload.base64Conversion(obj.image),
        })),
      };
    } catch (error) {
      console.log(error, 'error');
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }

  static async AddUser(req) {
    console.log("AddUser inside Model");
    try {
      let is_user_exist = knex(process.env.USERS)
        // .where("group_type", 2)
        .where("email", req.body.email)
        .andWhere("isdeleted", 1);

      let is_user_exist_check = await is_user_exist;

      if (is_user_exist_check.length) {
        return {
          success: false,
          message: "User Already Exist",
          data: {},
        };
      }
      let user_id;
      let query = knex
        .insert({
          id: crypto.randomUUID(),
          group_type: 3,
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: common.encryptPWD(req.body.password),
          image: req.files.image && req.files.image.length ? fileUpload.imageLoop(req.files) : '',
        })
        .returning("id")
        .into(process.env.USERS)
        .then(async (return_user_id) => {
          user_id = await return_user_id[0].id;
        });
      await query;

      let group_id_query = knex
        .select("id")
        .from(process.env.GROUP)
        .where("type", 3)
        .first();

      let group_id = await group_id_query;

      let mapping_query = knex(process.env.USERS_GROUP_MAPPING).insert({
        id: crypto.randomUUID(),
        user_id: user_id,
        group_id: group_id.id,
      });
      await mapping_query;

      return {
        success: true,
        message: "User Added Successfully",
        data: {},
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }

  static async UserListById(req) {
    console.log("UserListById inside Model");
    try {
      let query = knex(process.env.USERS).where('group_type', 3).andWhere("id", req.id)
        .andWhere("isdeleted", 1);
      let result = await query;
      console.log(result, "result");
      if (!result.length) {
        return {
          success: false,
          message: "No Record Found",
          data: {},
        };
      }
      return {
        success: true,
        message: "User Listed By Id Successfully",
        data: result.map((obj) => ({
          id: obj.id,
          name: obj.name,
          surname: obj.surname,
          email: obj.email,
          password: common.decryptPWD(obj.password),
          image:
            process.env.ENVIRONMENT_URL + "/" + obj.image ||
            fileUpload.base64Conversion(obj.image),
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }

  static async EditUser(req) {
    console.log("EditUser inside Model");
    let listbyId = await Users.EmployeeListById(req.params);
    if (listbyId.success) {
      try {
        let query = knex(process.env.USERS).where('group_type', 3).andWhere("id", req.params.id)
          .update({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            image: fileUpload.imageLoop(req.files),
          });
        let result = await query;

        if (!result) {
          return {
            success: false,
            message: "No Record Found",
            data: {},
          };
        }
        return {
          success: true,
          message: "User Edited Successfully",
          data: {},
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: {},
        };
      }
    } else {
      return {
        success: false,
        message: listbyId.message,
        data: {},
      };
    }
  }

  static async DeleteUser(req) {
    console.log("DeleteUser inside Model");
    let listbyId = await Users.EmployeeListById(req);
    if (listbyId.success) {
      try {
        let query = knex(process.env.USERS).where('group_type', 3).andWhere("id", req.id).update({
          isdeleted: 0,
        });

        let result = await query;
        if (!result) {
          return {
            success: false,
            message: "No Record Found",
            data: {},
          };
        }
        return {
          success: true,
          message: "User Deleted Successfully",
          data: {},
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          data: {},
        };
      }
    } else {
      return {
        success: false,
        message: listbyId.message,
        data: {},
      };
    }
  }


}

module.exports = Users;
