"use strict";
require("dotenv").config();
const Users = require("../Models/userModel.js");
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

  AddUser: async (req, res, next) => {
    console.log("AddUser inside Controller");
    let results = await Users.AddUser(req);
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
  UserList: async (req, res, next) => {
    console.log("UserList inside Controller", req.body);
    let results = await Users.UserList();
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
  UserListById: async (req, res, next) => {
    console.log("UserListById inside Controller");
    let results = await Users.UserListById(req.params);
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

  EditUser: async (req, res, next) => {
    console.log("EditUser inside Controller");
    let results = await Users.EditUser(req);
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

  DeleteUser: async (req, res, next) => {
    console.log("DeleteUser inside Controller");
    let results = await Users.DeleteUser(req.params);
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
