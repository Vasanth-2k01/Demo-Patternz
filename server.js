const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
// const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const { errorHandler } = require("./common/helpers");
require("dotenv").config();

const port = process.env.PORT || 2000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));
const upload = require("./uploadMiddleware");
app.use(upload);

// const upload = multer().none();
// app.use(upload);

var log = function (req, res, next) {
  // console.log(req.body);
  var readMe =
    "\n" + req.url + " | " + JSON.stringify(req.body) + " | " + new Date();
  fs.appendFile(__dirname + "/log.txt", readMe, (err) => {
    if (err) throw err;
    // console.log('The lyrics were updated!', req);
  });
  next();
};
app.use(log);

const passport = require("passport");
const passportConfig = require("./config/passport");
const passportJWT = passport.authenticate('jwt', { session: false })
const passportJWTADMIN = passport.authenticate('jwtAdmin', { session: false })
// const passportJWTSUPERADMIN = passport.authenticate('jwtSuperAdmin', { session: false })

app.use(passport.initialize());
// app.use(passport.session());

//Employee
var userroutes = require("./routes/userroutes")(passportJWT, passportJWTADMIN);
app.use("/user", userroutes);

var adminroutes = require("./routes/adminroutes")(passportJWT, passportJWTADMIN);
app.use("/admin", adminroutes);

// error handler
app.use(errorHandler);

//Listener..
app.listen(port, "0.0.0.0", () =>
  console.log(`Server running on port http://localhost:${port}`, new Date().getTime(), 'new Date()', crypto.randomUUID())
);
