const common = require("../common/common");
const helper = require("../common/helpers");

module.exports = (passportJWT, passportJWTADMIN) => {
  console.log("userroutes inside routes");
  const { validateBody, validateParams, validateQuery, schemas } = require("../routesvalidations/user");
  const userroutes = require("express-promise-router")();
  const userController = require("../controllers/userController.js");

  userroutes.route('/login').post(passportJWTADMIN, userController.Login)

  userroutes.route("/getUserList").get(
    passportJWT,
    userController.UserList);

  userroutes
    .route("/addUser")
    .post(
      passportJWT,
      // helper.isHavePermission('Users', 1),
      // validateBody(schemas.UserSchema),
      userController.AddUser
    );

  userroutes
    .route("/userListById/:id")
    .get(
      passportJWT,
      validateParams(schemas.UserIdSchema),
      userController.UserListById);

  userroutes
    .route("/editUser/:id")
    .put(passportJWT, validateParams(schemas.UserIdSchema), userController.EditUser);

  userroutes
    .route("/deleteUser/:id")
    .delete(passportJWT, validateParams(schemas.UserIdSchema), userController.DeleteUser);


  return userroutes;
};
