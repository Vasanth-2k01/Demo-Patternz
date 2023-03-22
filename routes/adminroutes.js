const common = require("../common/common");
const { isHavePermission } = require("../common/helpers");

module.exports = (passportJWT, passportJWTADMIN) => {
  console.log("adminroutes inside routes");
  const { validateBody, validateParams, validateQuery, schemas } = require("../routesvalidations/admin");
  const adminroutes = require("express-promise-router")();
  const adminController = require("../controllers/adminController.js");


  // adminroutes.route('/login').post(passportJWTADMIN, adminController.Login)

  adminroutes.route("/getProfile").get(
    passportJWT,
    adminController.getProfile);

  adminroutes.route("/getAdminList").get(
    passportJWT,
    isHavePermission("Admin", process.env.PERMISSION_LIST),
    adminController.AdminList);

  adminroutes
    .route("/addAdmin")
    .post(
      passportJWT,
      isHavePermission("Admin", process.env.PERMISSION_ADD),
      validateBody(schemas.AdminSchema),
      adminController.AddAdmin
    );

  adminroutes
    .route("/adminListById/:id")
    .get(
      passportJWT,
      isHavePermission("Admin", process.env.PERMISSION_EDIT),
      validateParams(schemas.AdminIdSchema),
      adminController.AdminListById);

  adminroutes
    .route("/editAdmin/:id")
    .put(passportJWT, validateParams(schemas.AdminIdSchema), isHavePermission("Admin", process.env.PERMISSION_EDIT), adminController.EditAdmin);

  adminroutes
    .route("/deleteAdmin/:id")
    .delete(passportJWT, validateParams(schemas.AdminIdSchema), isHavePermission("Admin", process.env.PERMISSION_DELETE), adminController.DeleteAdmin);


  return adminroutes;
};
