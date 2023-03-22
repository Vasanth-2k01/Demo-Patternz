var knex = require("../knex");
var crypto = require("crypto");
var JWT = require("jsonwebtoken");
var fileUpload = require("../common/fileupload");
var common = require("../common/common");
const dotenv = require("dotenv").config();
const { CustomError } = require('../utils/index');
const helpers = require("../common/helpers");

signToken = user => {
  var JWTEXP = user.expToken == 1 ? (new Date().getTime() + (365 * 24 * 60 * 60 * 1000)) : (new Date().getTime() + 604800 * 1000) / 1000;
  return JWT.sign({
    iss: process.env.JWT_ISS,
    sub: user.id,
    iat: (new Date().getTime() + 60 * 60 * 1000) / 1000,//new Date().getTime(), // current time
    exp: JWTEXP,
  }, process.env.JWT_SECRET);
}
class Admin {
  static async AdminList(req) {
    console.log("AdminList inside Model", req.query);
    try {
      var page = parseInt(req.query.page)
      var limit = parseInt(req.query.limit)
      var offsets = ((page - 1) * limit);

      let selectArray = ['id', 'name', 'surname', 'email', 'image']
      let rowcountQuery = knex(process.env.USERS).count('*').where('group_type', 2).andWhere("isdeleted", 1).first()
      let query = knex(process.env.USERS).select(selectArray).where('group_type', 2).andWhere("isdeleted", 1)
        .orderBy('created_at', 'asc').limit(limit).offset(offsets)
      console.log("query", query.toSQL());
      console.log("rowcountQuery", rowcountQuery.toSQL());

      // desc
      let rowcount = await rowcountQuery;
      let result = await query;
      // result.rows = result1.count
      console.log("result", result);
      console.log("rowcount", rowcount);
      if (!result) {
        return {
          success: false,
          message: "No record found",
          data: {},
        };
      }
      // let finalArray =
      result.data = await helpers.GetAllList(req.body, result.map(fileUpload.setImageUrl), rowcount.count, page, limit, offsets, 'admin/getAdminList')
      console.log(result.data, 'result.data');
      return {
        success: true,
        message: "Admin Listed Successfully",
        data: result.data
      };
    } catch (error) {
      throw new CustomError(error.message, 500, null)
    }
  }

  static async AddAdmin(req) {
    console.log("AddAdmin inside Model");
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
      let admin_id;
      let query = knex
        .insert({
          id: crypto.randomUUID(),
          group_type: 2,
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: common.encryptPWD(req.body.password),
          image: req.files.image && req.files.image.length ? fileUpload.imageLoop(req.files) : '',
        })
        .returning("id")
        .into(process.env.USERS)
        .then(async (return_admin_id) => {
          admin_id = await return_admin_id[0].id;
        });
      await query;

      let group_id_query = knex
        .select("id")
        .from(process.env.GROUP)
        .where("type", 2)
        .first();

      let group_id = await group_id_query;

      let mapping_query = knex(process.env.USERS_GROUP_MAPPING).insert({
        id: crypto.randomUUID(),
        user_id: admin_id,
        group_id: group_id.id,
      });
      await mapping_query;

      return {
        success: true,
        message: "Admin Added Successfully",
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

  static async AdminListById(req) {
    console.log("AdminListById inside Model");
    try {
      let selectArray = ['id', 'name', 'surname', 'email', 'image']
      let query = knex(process.env.USERS).select(selectArray).where('group_type', 2).andWhere("id", req.id)
        .andWhere("isdeleted", 1).first();
      let result = await query;
      console.log(result, "result");
      if (!result) {
        return {
          success: false,
          message: "No Record Found",
          data: {},
        };
      }
      return {
        success: true,
        message: "Admin Listed By Id Successfully",
        data: fileUpload.setImageUrl(result)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }

  static async EditAdmin(req) {
    console.log("EditAdmin inside Model");
    let listbyId = await Admin.EmployeeListById(req.params);
    if (listbyId.success) {
      try {
        let query = knex(process.env.USERS).where('group_type', 2).andWhere("id", req.params.id)
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
          message: "Admin Edited Successfully",
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

  static async DeleteAdmin(req) {
    console.log("DeleteAdmin inside Model");
    let listbyId = await Admin.EmployeeListById(req);
    if (listbyId.success) {
      try {
        let query = knex(process.env.USERS).where('group_type', 2).andWhere("id", req.id).update({
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
          message: "Admin Deleted Successfully",
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

module.exports = Admin;
