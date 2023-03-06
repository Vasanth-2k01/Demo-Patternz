const common = require("../common/common");

module.exports = (passportJWT, passportJWTADMIN) => {
  console.log("adminroutes inside routes");
  const { validateBody, validateParams, validateQuery, schemas } = require("../routesvalidations/admin");
  const adminroutes = require("express-promise-router")();
  const adminController = require("../controllers/adminController.js");

  // adminroutes.route('/login').post(passportJWTADMIN, adminController.Login)

  adminroutes.route("/getAdminList").get(
    passportJWT,
    adminController.AdminList);

  adminroutes
    .route("/addAdmin")
    .post(
      passportJWT,
      // common.isHavePermission,
      // validateBody(schemas.AdminSchema),
      adminController.AddAdmin
    );

  adminroutes
    .route("/adminListById/:id")
    .get(
      passportJWT,
      validateParams(schemas.AdminIdSchema),
      adminController.AdminListById);

  adminroutes
    .route("/editAdmin/:id")
    .put(passportJWT, validateParams(schemas.AdminIdSchema), adminController.EditAdmin);

  adminroutes
    .route("/deleteAdmin/:id")
    .delete(passportJWT, validateParams(schemas.AdminIdSchema), adminController.DeleteAdmin);


  return adminroutes;
};
