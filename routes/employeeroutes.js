module.exports = (passportJWT, passportJWTUSERS) => {
  console.log("employeeroutes inside routes");
  const { validateBody, validateParams, validateQuery, schemas } = require("../routesvalidations/employee");
  const employeeroutes = require("express-promise-router")();
  const employeeController = require("../controllers/employeeController.js");

  employeeroutes.route('/login').post(passportJWTUSERS, employeeController.Login)

  employeeroutes.route("/getEmployeeList").get(
    passportJWT,
    employeeController.EmployeeList);

  employeeroutes
    .route("/getEmployeeListByType")
    .get(employeeController.EmployeeListByType);

  employeeroutes
    .route("/addEmployee")
    .post(
      // validateBody(schemas.EmployeeSchema),
      employeeController.AddEmployee
    );

  employeeroutes
    .route("/EmployeeListById/:id")
    .get(
      validateParams(schemas.EmployeeIdSchema),
      employeeController.EmployeeListById);

  employeeroutes
    .route("/editEmployee/:id")
    .put(validateParams(schemas.EmployeeIdSchema), employeeController.EditEmployee);

  employeeroutes
    .route("/deleteEmployee/:id")
    .delete(validateParams(schemas.EmployeeIdSchema), employeeController.DeleteEmployee);

  employeeroutes
    .route("/getEmployeeListWithGroup")
    .get(employeeController.getEmployeeListWithGroup);

  return employeeroutes;
};
