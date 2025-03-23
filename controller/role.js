import rand from "random-key";

import "../models/Role/RoleAssociation.js";
import Role from "../models/Role/Role.js";
import Role_list from "../models/Role/Role_list.js";

import Event from "../models/Event/Event.js";

import "../models/User/UserAssociation.js";
import User from "../models/User/User.js";
import User_credential from "../models/User/User_credential.js";

import {
  requestValidation,
  requestParameter,
} from "../utility/requestValidation.js";
import createApiResponse from "../utility/httpResponse.js";
import { where } from "sequelize";

export default class RoleController {
  async register(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;
    var roleresponse;

    if (role == "user") {
      try {
        roleresponse = await Role.findOne({
          where: { user_id: id },
          attributes: [],
          include: [
            {
              model: Role_list,
              as: "role_list",
              attributes: ["name"],
            },
          ],
        });
      } catch (error) {
        console.log("role.js error1: ", error);
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
      if (roleresponse == null) {
        return res
          .status(403)
          .json(createApiResponse({ response: "restricted content" }, 403));
      }
      roleresponse = roleresponse.toJSON();
      role = roleresponse.role_list.name;
    }

    const acceptedRole = ["root", "admin"];
    if (!acceptedRole.includes(role)) {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }

    const reqBody = req.body;
    const requiredFeild = ["event_name", "email", "role"];
    if (!requestValidation(requiredFeild, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }
    if (role == reqBody.role) {
      return res
        .status(403)
        .json(
          createApiResponse({ response: "admin cannot create admin" }, 403)
        );
    }

    try {
      var eventId;
      var userId;
      var roleId;
      let isUserCreated = false;
      var eventresponse;

      if (role == "root") {
        eventresponse = await Event.findOne({
          where: { root_id: id, name: reqBody.event_name },
        });
        if (eventresponse == null) {
          return res
            .status(404)
            .json(createApiResponse({ response: "event not found" }, 400));
        }
        eventresponse = eventresponse.toJSON();
        eventId = eventresponse.id;
      } else {
        eventresponse = await Event.findOne({
          where: { name: reqBody.event_name, "$role.user_id$": id },
          include: { model: Role, as: "role" },
        });
        if (eventresponse == null) {
          return res
            .status(403)
            .json(createApiResponse({ response: "restricted content" }, 403));
        }
        eventresponse = eventresponse.toJSON();
        eventId = eventresponse.id;
      }
      var userresponse = await User.findOne({
        where: { email: reqBody.email },
      });
      if (userresponse == null) {
        const email = reqBody.email;
        const password = rand.generate(10);
        var newuserresponse = await User.create(
          {
            email: email,
            user_credential: { password: password },
          },
          {
            include: { model: User_credential, as: "user_credential" },
          }
        );
        newuserresponse = newuserresponse.toJSON();
        userId = newuserresponse.id;
        isUserCreated = true;
      } else {
        userresponse = userresponse.toJSON();
        userId = userresponse.id;
      }

      roleresponse = await Role_list.findOne({
        where: { name: reqBody.role },
      });
      if (roleresponse == null) {
        return res
          .status(404)
          .json(createApiResponse({ response: "role not found" }, 400));
      }
      roleresponse = roleresponse.toJSON();
      roleId = roleresponse.id;

      await Role.create({
        user_id: userId,
        role_list_id: roleId,
        event_id: eventId,
      });
      if (isUserCreated) {
        return res
          .status(201)
          .json(createApiResponse({ response: "user and role created" }, 201));
      }
      return res
        .status(201)
        .json(createApiResponse({ response: "role created" }, 201));
    } catch (error) {
      console.log("role.js error2: ", error);
      if (error.name == "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(
            createApiResponse({ response: "user and role already exists" }, 409)
          );
      }
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async get(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;
    const reqBody = req.body;
    var event_id;

    const requestParameterFeilds = ["event_name"];
    if (!requestParameter(requestParameterFeilds, reqBody)) {
      if (!requestParameter(requestParameterFeilds, reqBody)) {
        return res
          .status(400)
          .json(createApiResponse({ response: "unwanted feilds" }, 400));
      }
    }

    if (!reqBody["event_name"])
      return res.status(200).json(createApiResponse({ role }, 200));
    if (role == "user") {
      try {
        var roleResponse = await Role.findOne({
          where: { user_id: id },
          attributes: [],
          include: [
            {
              model: Role_list,
              as: "role_list",
              attributes: ["name"],
            },
            {
              model: Event,
              where: { name: reqBody.event_name },
              as: "event",
            },
          ],
        });
      } catch (error) {
        console.log("customerSurvey.js error1: ", error);
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
      if (roleResponse == null) {
        return res
          .status(403)
          .json(createApiResponse({ response: "restricted content" }, 403));
      }
      roleResponse = roleResponse.toJSON();
      role = roleResponse["role_list"]["name"];
      event_id = roleResponse["event"]["id"];
    } else {
      try {
        var response = await Event.findOne({
          where: { root_id: id, name: reqBody.event_name },
        });
        if (response == null) {
          return res
            .status(404)
            .json(createApiResponse({ response: "event not found" }, 404));
        }
      } catch (error) {
        console.log("customerSurvey.js error2: ", error);
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
      response = response.toJSON();
      event_id = response["id"];
    }

    return res.status(200).json(createApiResponse({ role }, 200));
  }
  async getUserRole(req, res) {
    const reqBody = req.body;
    const id = req.middleware.id;
    const role = req.middleware.role;

    if (role == "root") {
      var response = await Event.findAll({
        where: { root_id: id },
        attributes: ["name"],
      });
      response = response.map((event) => event.toJSON());
      var data = {};
      response.map((event) => {
        data = { ...data, event: event, role_list: { name: "root" } };
      });
      console.log(response);
    }

    const requestParameterFeilds = ["count"];

    if (!requestParameter(requestParameterFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "unwanted feilds" }, 400));
    }

    var response;

    if (role == "root") {
      response = await Event.findAll({
        where: { root_id: id },
        attributes: ["name"],
      });
      if (response) {
        response = response.map((event) => {
          event = event.toJSON();
          return { event, role_list: { name: "root" } };
        });
      }
    } else {
      response = await Role.findAll({
        where: { user_id: id },
        attributes: [],
        include: [
          { model: Role_list, as: "role_list", attributes: ["name"] },
          { model: Event, as: "event", attributes: ["name"] },
        ],
      });
      if (response) {
        response = response.map((res) => res.toJSON());
      }
    }

    if (reqBody["count"] && reqBody["count"] == "true") {
      if (role == "root") {
        return res.status(200).json(
          createApiResponse(
            {
              total_count: response.length,
            },
            200
          )
        );
      }
      var total_count = 0;
      var admin_count = 0;
      response.map((item) => {
        total_count += 1;
        if (item["role_list"]["name"] == "admin") admin_count += 1;
      });
      return res.status(200).json(
        createApiResponse(
          {
            total_count,
            admin_count,
            reporter_count: total_count - admin_count,
          },
          200
        )
      );
    }
    return res.status(200).json(createApiResponse(response, 200));
  }
  async getEventRole(req, res) {
    const reqBody = req.body;
    const id = req.middleware.id;
    const role = req.middleware.role;

    const requiredFeilds = ["event_name"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

    if (role != "root") {
      return res
        .status(500)
        .json(createApiResponse({ response: "restricted access" }, 409));
    }
    try {
      var event_response = await Event.findOne({
        where: { name: reqBody.event_name },
      });
      event_response = event_response.toJSON();
      if (!event_response) {
        return res
          .status(404)
          .json(createApiResponse({ response: "event not found" }, 404));
      }
      var role_response = await Role.findAll({
        where: { event_id: event_response.id },
        include: [
          { model: Role_list, as: "role_list", attributes: ["name"] },
          { model: User, as: "user", attributes: ["email"] },
        ],
        attributes: [],
      });
      role_response = role_response.map((resposne) => resposne.toJSON());
      return res.status(200).json(createApiResponse(role_response, 200));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  // async delete(req, res) {}
  async getRole(req, res) {
    try {
      var response = await Role_list.findAll({
        attributes: ["name", "description"],
      });
      response = response.map((plan) => plan.toJSON());
      var resBody = { role_list: response };
      return res.status(200).json(createApiResponse(resBody, 200));
    } catch (error) {
      console.log("role.js error3: ", error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async createRole(req, res) {
    const reqBody = req.body;
    const requiredFeilds = ["name", "description"];
    if (!requestValidation(requiredFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }
    const name = reqBody.name;
    const description = reqBody.description;
    try {
      await Role_list.create({ name, description });
      return res
        .status(201)
        .json(createApiResponse({ response: "role created" }, 201));
    } catch (error) {
      console.log("role.js error4: ", error);
      if (error.name == "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(createApiResponse({ response: "role already exists" }, 409));
      }
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
}
