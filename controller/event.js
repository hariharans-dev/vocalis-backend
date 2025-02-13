import createApiResponse from "../utility/httpResponse.js";
import { requestValidation } from "../utility/requestValidation.js";

import "../models/Event/EventAssociation.js";
import Event from "../models/Event/Event.js";
import Event_detail from "../models/Event/Event_detail.js";

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
      console.log(error);
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
  async get(req, res) {}
  async update(req, res) {}
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
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 400));
    }
  }
}
