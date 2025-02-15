import rand from "random-key";

import "../models/Role/RoleAssociation.js";
import Role from "../models/Role/Role.js";
import Role_list from "../models/Role/Role_list.js";

import Event from "../models/Event/Event.js";

import "../models/User/UserAssociation.js";
import User from "../models/User/User.js";
import User_credential from "../models/User/User_credential.js";

import { requestValidation } from "../utility/requestValidation.js";
import createApiResponse from "../utility/httpResponse.js";

export default class RoleController {
  async register(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;

    if (role == "user") {
      try {
        var roleresponse = await Role.findOne({
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

      if (role == "root") {
        var eventresponse = await Event.findOne({
          where: { root_id: id, name: reqBody.event_name },
        });
        if (eventresponse == null) {
          return res.status(404).json({ response: "event not found" }, 400);
        }
        eventresponse = eventresponse.toJSON();
        eventId = eventresponse.id;
      } else {
        var eventresponse = await Event.findOne({
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

      console.log(reqBody.role);
      var roleresponse = await Role_list.findOne({
        where: { name: reqBody.role },
      });
      if (roleresponse == null) {
        return res.status(404).json({ response: "role not found" }, 400);
      }
      roleresponse = roleresponse.toJSON();
      console.log(roleresponse);
      roleId = roleresponse.id;

      console.log(eventId, userId, roleId);
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
      // console.log(error);
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
  async get(req, res) {}
  async delete(req, res) {}
  async getRole(req, res) {
    const token = req.middleware.token;
    try {
      var response = await Role_list.findAll({});
      response = response.map((plan) => plan.toJSON());
      var resBody = { role_list: response };
      if (token) {
        resBody = { ...resBody, token: token };
      }
      return res.status(200).json(createApiResponse(resBody, 200));
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
