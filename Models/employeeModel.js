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
class Employees {
  static async EmployeeList() {
    console.log("EmployeeList inside Model");
    try {
      let query = knex(process.env.USERS).where("isdeleted", 1);
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
        message: "Employee Listed Successfully",
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

  static async AddEmployee(req) {
    console.log("AddEmployee inside Model");
    try {
      let is_user_exist = knex(process.env.USERS)
        .where("email", req.body.email)
        .andWhere("isdeleted", 1);

      let is_user_exist_check = await is_user_exist;

      if (is_user_exist_check.length) {
        return {
          success: false,
          message: "Employee Already Exist",
          data: {},
        };
      }
      let employee_id;
      let query = knex
        .insert({
          id: crypto.randomUUID(),
          group_type: req.body.group_type,
          name: req.body.name,
          surname: req.body.surname,
          email: req.body.email,
          password: common.encryptPWD(req.body.password),
          image: fileUpload.imageLoop(req.files),
        })
        .returning("id")
        .into(process.env.USERS)
        .then((id) => {
          id.map((emp_id) => {
            employee_id = emp_id.id;
          });
        });
      await query;

      let group_id_query = knex
        .select("id")
        .from(process.env.GROUP)
        .where("type", req.body.group_type)
        .first();

      let group_id = await group_id_query;

      let mapping_query = knex(process.env.USERS_GROUP_MAPPING).insert({
        id: crypto.randomUUID(),
        employee_id: employee_id,
        group_id: group_id.id,
      });
      await mapping_query;

      return {
        success: true,
        message: "Employee Added Successfully",
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

  static async EmployeeListById(req) {
    console.log("EmployeeListById inside Model");
    try {
      let query = knex(process.env.USERS)
        .where("id", req.id)
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
        message: "Employee Listed By Id Successfully",
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

  static async EditEmployee(req) {
    console.log("EditEmployee inside Model");
    let listbyId = await Employees.EmployeeListById(req.params);
    if (listbyId.success) {
      try {
        let query = knex(process.env.USERS)
          .where("id", req.params.id)
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
          message: "Employee Edited Successfully",
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

  static async DeleteEmployee(req) {
    console.log("DeleteEmployee inside Model");
    let listbyId = await Employees.EmployeeListById(req);
    if (listbyId.success) {
      try {
        let query = knex(process.env.USERS).where("id", req.id).update({
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
          message: "Employee Deleted Successfully",
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
  static async EmployeeListByType(req) {
    console.log("EmployeeListByType inside Model", req.query);
    try {
      // let query = knex(`${process.env.USERS} as e`)
      //   .leftJoin(
      //     `${process.env.USERS_GROUP_MAPPING} as egm`,
      //     "e.id",
      //     "egm.employee_id"
      //   )
      //   .join(`${process.env.GROUP} as g`, "g.id", "egm.group_id")
      //   .where("g.type", req.query.type);

      let query = knex(process.env.USERS)
        .where("group_type", req.query.type)
        .andWhere("isdeleted", 1);
      let result = await query;
      if (!result.length) {
        return {
          success: false,
          message: "No Record Found",
          data: {},
        };
      }
      return {
        success: true,
        message: "Employee Listed Successfully",
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }
  static async getEmployeeListWithGroup() {
    console.log("getEmployeeListWithGroup inside Model");
    try {

      // let query = knex.raw(`select e.name ,
      // (select json_build_object( 'group_id', json_agg(g.id) ,'group_name', json_agg(g."name"))
      // from "group" g left join employee_group_mapping egm on g.id = egm.group_id where e.id = egm.employee_id) 
      // as group  from employee e`);


      // let query = knex.raw(`select e.name ,
      // (select json_build_object('grp',array_agg('{group_id:' || g.id || ',group_name:' || g."name"  || '}'))
      // from "group" g left join employee_group_mapping egm on g.id = egm.group_id where e.id = egm.employee_id) 
      // as group  from employee e`)


      let query = knex.raw(`select e."name",(select
      array_agg ('{group_id:' || g.id || ',group_name:' || g."name"  || '}')
      from employee_group_mapping egm left join "group" g on g.id = egm.group_id 
      where egm.employee_id = e.id ) as group from employee e`);
      let result = await query;
      if (!result) {
        return {
          success: false,
          message: "No Record Found",
          data: {},
        };
      }
      console.log(result.rows, "result");
      let json = JSON.stringify(result.rows)
      console.log(JSON.parse(json), "result");
      return {
        success: true,
        message: "Employee Listed Successfully",
        data: result.rows,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: {},
      };
    }
  }
}

module.exports = Employees;
