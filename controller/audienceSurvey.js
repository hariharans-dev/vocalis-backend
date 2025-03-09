import rand from "random-key";

import createApiResponse from "../utility/httpResponse.js";
import { text_insight } from "../utility/insights.js";
import {
  requestValidation,
  requestParameter,
} from "../utility/requestValidation.js";

import "../models/Event/EventAssociation.js";
import Event from "../models/Event/Event.js";
// import Event_detail from "../models/Event/Event_detail.js";

import "../models/Role/RoleAssociation.js";
import Role from "../models/Role/Role.js";
import Role_list from "../models/Role/Role_list.js";

import "../models/Survey/SurveyAssociation.js";
import Audience from "../models/Survey/Audience.js";
import Audience_survey from "../models/Survey/Audience_survey.js";
import Report from "../models/Survey/Report.js";
import { Sequelize } from "sequelize";

export default class AudienceController {
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
        console.log("customerSurvey.js error2: ", error);
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
      console.log("customerSurvey.js error3: ", error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async getEndpoint(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;
    const reqBody = req.body;
    var event_endpoint;
    var event_id;

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
        console.log("customerSurvey.js error2: ", error);
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

    return res.status(200).json(createApiResponse({ event_endpoint }, 200));
  }
  async registerData(req, res) {
    const reqBody = req.body;
    const requestParameterFeilds = [
      "message",
      "event_endpoint",
      "name",
      "mobile",
      "email",
      "address",
    ];
    if (!requestParameter(requestParameterFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "unwanted feilds" }, 400));
    }
    const requiredFeilds = ["message", "event_endpoint"];
    if (!requestValidation(requiredFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

    var response;
    var event_id;
    var audience_id;
    try {
      response = await Event.findOne({
        where: { endpoint: reqBody.event_endpoint },
      });
      if (response) {
        response = response.toJSON();
        event_id = response.id;
      } else {
        return res
          .status(404)
          .json(
            createApiResponse({ response: "event_endpoint not found" }, 404)
          );
      }

      const { message, ...data } = reqBody;
      response = await Audience.create(data);
      response = response.toJSON();
      audience_id = response.id;

      await Audience_survey.create({
        data: reqBody.message,
        event_id,
        audience_id,
      });

      return res
        .status(201)
        .json(createApiResponse({ response: "feedback sent" }, 201));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async getData(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;
    const reqBody = req.body;
    var event_id;

    const requestParameterFeilds = ["event_name", "limit"];
    if (!requestParameter(requestParameterFeilds, reqBody)) {
      if (!requestParameter(requestParameterFeilds, reqBody)) {
        return res
          .status(400)
          .json(createApiResponse({ response: "unwanted feilds" }, 400));
      }
    }

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

    const acceptedRole = ["root", "admin"];
    if (!acceptedRole.includes(role)) {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }

    var response;
    try {
      var options = {
        where: { event_id: event_id },
        attributes: ["data"],
        include: {
          model: Audience,
          as: "audience",
          attributes: ["name", "mobile", "email", "address"],
        },
      };

      if (reqBody.limit !== undefined && reqBody.limit !== null) {
        options.limit = parseInt(req.body.limit, 10);
      }

      response = await Audience_survey.findAll(options);
      if (response) {
        response = response.map((res) => res.toJSON());
      }
      return res.send(response);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async createReport(req, res) {
    const id = req.middleware.id;
    var role = req.middleware.role;
    const reqBody = req.body;
    var event_id;

    const requestParameterFeilds = ["event_name", "duration"];
    if (!requestParameter(requestParameterFeilds, reqBody)) {
      if (!requestParameter(requestParameterFeilds, reqBody)) {
        return res
          .status(400)
          .json(createApiResponse({ response: "unwanted feilds" }, 400));
      }
    }
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

    const acceptedRole = ["root", "admin"];
    if (!acceptedRole.includes(role)) {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    var response;
    const duration = reqBody.duration;
    try {
      var options = { where: { event_id }, attributes: ["data"] };

      if (duration && duration != "all") {
        const parsedDuration = parseInt(duration, 10);

        if (isNaN(parsedDuration)) {
          throw new Error("Invalid duration value");
        }

        const now = new Date();
        const threshold = new Date(now.getTime() - parsedDuration * 1000);
        options["where"]["createdAt"] = { [Sequelize.Op.gte]: threshold };
      }

      response = await Audience_survey.findAll(options);
      if (response) {
        response = response.map((res) => res.toJSON());
      }
      if (!response[0]) {
        return res
          .status(200)
          .json(createApiResponse({ response: "no feedback" }, 200));
      }

      response = response.map((res) => res.data);
      var data = { feedback: response };

      // response send to generateReport for generating report
      response = await Report.create({
        event_id,
        user_id: id,
        user_type: role,
        report_type: "audience",
      });
      response = response.toJSON();
      data["id"] = response.id;

      text_insight(data);

      return res
        .status(201)
        .json(
          createApiResponse({ response: "initiated report generation" }, 201)
        );
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async getReport(req, res) {}
}
