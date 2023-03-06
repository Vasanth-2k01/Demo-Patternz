"use strict";
require("dotenv").config();
const Admin = require("../Models/adminModel.js");
const common = require("../common/common");
module.exports = {
  Login: async (req, res, next) => {
    console.log("Login inside Controller");
    console.log('req.user', req.user, req.user[0].id, 'req.user[0].id');
    if (!req.user) {
      return res.status(401).send({ status: 0, message: 'invalid email/password', result: {} });
    }
    let encryptedId = common.encrypt(req.user[0].id)
    let token = { id: encryptedId, expToken: 1 }
    let refreshtoken = { id: encryptedId, expToken: 0 }
    res.setHeader('access_token', signToken(token))
    res.setHeader('refresh_token', signToken(refreshtoken))
    res.status(200).send({ status: 0, message: 'Logged In Successfully', result: {} });
  },

  AddAdmin: async (req, res, next) => {
    console.log("AddAdmin inside Controller");
    let results = await Admin.AddAdmin(req);
    if (results.success) {
      res.status(200).send({
        status: 1,
        message: results.message,
        result: results.data,
      });
    } else {
      res.status(400).send({
        status: 0,
        message: results.message,
        result: {},
      });
    }
  },
  AdminList: async (req, res, next) => {
    console.log("AdminList inside Controller", req.body);
    let results = await Admin.AdminList();
    if (results.success) {
      res.status(200).send({
        status: 1,
        message: results.message,
        result: results.data,
      });
    } else {
      res.status(400).send({
        status: 0,
        message: results.message,
        result: {},
      });
    }
  },
  AdminListById: async (req, res, next) => {
    console.log("AdminListById inside Controller");
    let results = await Admin.AdminListById(req.params);
    if (results.success) {
      res.status(200).send({
        status: 1,
        message: results.message,
        result: results.data,
      });
    } else {
      res.status(400).send({
        status: 0,
        message: results.message,
        result: {},
      });
    }
  },

  EditAdmin: async (req, res, next) => {
    console.log("EditAdmin inside Controller");
    let results = await Admin.EditAdmin(req);
    if (results.success) {
      res.status(200).send({
        status: 1,
        message: results.message,
        result: results.data,
      });
    } else {
      res.status(400).send({
        status: 0,
        message: results.message,
        result: {},
      });
    }
  },

  DeleteAdmin: async (req, res, next) => {
    console.log("DeleteAdmin inside Controller");
    let results = await Admin.DeleteAdmin(req.params);
    if (results.success) {
      res.status(200).send({
        status: 1,
        message: results.message,
        result: results.data,
      });
    } else {
      res.status(400).send({
        status: 0,
        message: results.message,
        result: {},
      });
    }
  },
};
