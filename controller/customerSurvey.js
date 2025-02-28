import rand from "random-key";

import createApiResponse from "../utility/httpResponse.js";
import { requestValidation } from "../utility/requestValidation.js";

import "../models/Event/EventAssociation.js";
import Event from "../models/Event/Event.js";
// import Event_detail from "../models/Event/Event_detail.js";

import "../models/Role/RoleAssociation.js";
import Role from "../models/Role/Role.js";
import Role_list from "../models/Role/Role_list.js";
import { where } from "sequelize";

export default class CustomerController {
  async registerEndpoint(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;
    const reqBody = req.body;
    var event_id;
    var event_endpoint;

    const requiredFeilds = ["event_name"];
    if (!requestValidation(requiredFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

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
      event_endpoint = roleResponse["event"]["endpoint"];
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
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
      response = response.toJSON();
      event_id = response["id"];
      event_endpoint = response["endpoint"];
    }

    const acceptedRole = ["root", "admin"];
    if (!acceptedRole.includes(role)) {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }

    if (event_endpoint != null) {
      return res
        .status(409)
        .json(createApiResponse({ response: "event endpoint exists" }, 409));
    }
    event_endpoint = rand.generate(36);
    try {
      await Event.update(
        { endpoint: event_endpoint },
        { where: { id: event_id } }
      );
      return res
        .status(202)
        .json(createApiResponse({ response: "endpoint created" }, 202));
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  // async registerData(req, res) {}
}
