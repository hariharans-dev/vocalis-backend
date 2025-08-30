import createApiResponse from "../utility/httpResponse.js";
import {
  requestValidation,
  requestParameter,
} from "../utility/requestValidation.js";

import sequelize from "../db/db_connection.js";

import "../models/Event/EventAssociation.js";
import "../models/Role/RoleAssociation.js";

import Event from "../models/Event/Event.js";
import Event_detail from "../models/Event/Event_detail.js";

import Role from "../models/Role/Role.js";
import Role_list from "../models/Role/Role_list.js";
import { where } from "sequelize";

export default class EventController {
  async register(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "root") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    const token = req.middleware.token;

    const reqBody = req.body;
    const requiredFeilds = ["event_name", "description"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }
    const eventName = reqBody.event_name;
    const eventDescription = reqBody.description;

    try {
      await Event.create(
        {
          root_id: id,
          name: eventName,
          event_detail: { description: eventDescription },
        },
        { include: { model: Event_detail, as: "event_detail" } }
      );

      var resBody = { response: "event created" };
      if (token) {
        resBody = { ...resBody, token: token };
      }
      return res.status(201).json(createApiResponse(resBody, 201));
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(createApiResponse({ response: "event name exists" }, 409));
      } else {
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
    }
  }
  async get(req, res) {
    let reqBody = req.body;

    if (typeof reqBody === "string") {
      try {
        reqBody = JSON.parse(reqBody);
      } catch (e) {
        reqBody = {};
      }
    }

    if (reqBody && "event_endpoint" in reqBody) {
      var response = await Event.findOne({
        where: {
          endpoint: reqBody.event_endpoint,
        },
        attributes: ["name"],
      });

      if (response) {
        response = response.toJSON();
        return res
          .status(403)
          .json(createApiResponse({ event: response.name }, 200));
      }
      return res
        .status(403)
        .json(
          createApiResponse({ response: "no event with that endpoint" }, 400)
        );
    }

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

    const acceptedRole = ["root", "admin", "reporter"];
    if (!acceptedRole.includes(role)) {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }

    var response;
    try {
      if (role == "root") {
        response = await Event.findOne({
          where: { root_id: id, name: reqBody.event_name },
          attributes: ["name", "endpoint"],
        });
      } else {
        response = await Event.findOne({
          where: { name: reqBody.event_name, "$role.user_id$": id },
          attributes: ["name", "endpoint"],
          include: [
            { model: Role, as: "role", attributes: [] },
            {
              model: Event_detail,
              as: "event_detail",
              attributes: ["location", "phone", "email", "description", "date"],
            },
          ],
        });
      }
      if (response == null) {
        return res
          .status(404)
          .json(createApiResponse({ response: "no such event or role" }, 404));
      }
      response = response.toJSON();
      return res.status(200).json(createApiResponse(response, 200));
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async update(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;
    const reqBody = req.body;
    const acceptedFeilds = [
      "event_name",
      "name",
      "email",
      "phone",
      "description",
      "date",
      "location",
    ];
    if (!requestParameter(acceptedFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "unwanted feilds" }, 400));
    }
    const requiredFeilds = ["event_name"];
    if (!requestValidation(requiredFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }
    try {
      var EventId;
      if (role == "root") {
        var response = await Event.findOne({
          where: { name: reqBody.event_name, root_id: id },
          attributes: ["id"],
        });
        if (!response) {
          return res
            .status(400)
            .json(createApiResponse({ response: "event not found" }, 400));
        }
        EventId = response.id;
      } else {
        var response = await Event.findOne({
          where: { name: reqBody.event_name },
          attributes: ["id"],
        });
        if (!response) {
          return res
            .status(400)
            .json(createApiResponse({ response: "event not found" }, 400));
        }
        EventId = response.id;
        response = await Role.findAll({
          where: { user_id: id, event_id: EventId },
          attributes: [[sequelize.col("role_list.name"), "role"]],
          include: [{ model: Role_list, as: "role_list", attributes: [] }],
        });
        if (!response) {
          return res
            .status(400)
            .json(createApiResponse({ response: "event not found" }, 400));
        }
        const adminRole = response.find((data) => {
          const jsonData = data.toJSON();
          return jsonData.role === "admin";
        });

        if (adminRole) {
          role = "admin";
        }
      }
      const acceptedRole = ["root", "admin"];
      if (!acceptedRole.includes(role)) {
        return res
          .status(403)
          .json(createApiResponse({ response: "restricted content" }, 403));
      }
      var data = reqBody;
      delete data.event_name;
      if (data["name"]) {
        await Event.update({ name: data.name }, { where: { id: EventId } });
        delete data.name;
      }
      if (data) {
        await Event_detail.update(data, { where: { event_id: EventId } });
      }
      return res
        .status(200)
        .json(createApiResponse({ response: "update successfull" }, 200));
    } catch (error) {
      if (error.name == "SequelizeDatabaseError") {
        return res
          .status(400)
          .json(
            createApiResponse({ response: "input not in proper format" }, 400)
          );
      }
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server" }, 500));
    }
  }
  async delete(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    const token = req.middleware.token;

    if (role != "root") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted access" }, 403));
    }
    const reqBody = req.body;
    const requiredFeilds = ["event_name"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }
    const eventName = reqBody.event_name;
    try {
      const response = await Event.destroy({
        where: { root_id: id, name: eventName },
      });
      var resBody;
      if (response == 0) {
        return res
          .status(404)
          .json(createApiResponse({ response: "event not found" }, 404));
      }

      resBody = { response: "event deleted successful" };
      if (token) {
        resBody = { ...resBody, token: token };
      }
      return res.status(202).json(createApiResponse(resBody, 202));
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
}
