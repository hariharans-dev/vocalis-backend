import {
  requestParameter,
  requestValidation,
} from "../utility/requestValidation.js";
import { Sequelize } from "sequelize";
import createApiResponse from "../utility/httpResponse.js";
import { voice_text, text_insight } from "../utility/insights.js";

import "../models/Event/EventAssociation.js";
import Event from "../models/Event/Event.js";

import "../models/Role/RoleAssociation.js";
import Role from "../models/Role/Role.js";
import Role_list from "../models/Role/Role_list.js";

import "../models/Survey//SurveyAssociation.js";
import Audience from "../models/Survey/Audience.js";
import Reporter_survey from "../models/Survey/Reporter_survey.js";
import Report from "../models/Survey/Report.js";

export default class ReporterController {
  async createData(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    const reqBody = req.body;
    console.log(reqBody);

    const parameterFeilds = [
      "name",
      "email",
      "mobile",
      "address",
      "event_name",
      "file",
    ];
    if (!requestParameter(parameterFeilds, reqBody)) {
      return res
        .status(400)
        .json(createApiResponse({ response: "unwanted request feilds" }, 400));
    }

    const requiredFeilds = ["event_name", "file"];
    if (!requestValidation(requiredFeilds, reqBody)) {
      return res
        .status(404)
        .json(createApiResponse({ response: "required feilds misssing" }, 404));
    }

    var response;
    var event_id;
    var audience_id;
    var survey_id;
    try {
      if (role == "root") {
        response = await Event.findOne({ where: { root_id: id } });
        if (!response) {
          return res
            .status(404)
            .json(createApiResponse({ response: "event not found" }, 404));
        }
        response = response.toJSON();
        event_id = response.id;
      } else {
        response = await Role.findOne({ where: { user_id: id } });
        if (!response) {
          return res
            .status(404)
            .json(createApiResponse({ response: "event not found" }, 404));
        }
        response = response.toJSON();
        event_id = response.event_id;
      }

      const { event_name, file, ...audience_data } = reqBody;
      response = await Audience.create(audience_data);
      if (!response) {
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }

      response = response.toJSON();
      audience_id = response.id;

      response = await Reporter_survey.create({
        audience_id,
        user_id: id,
        user_type: role,
        event_id,
      });
      if (!response) {
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
      response = response.toJSON();
      survey_id = response.id;

      await voice_text(survey_id, reqBody.file);

      return res
        .status(201)
        .json(createApiResponse({ response: "voice feedback stored" }, 201));
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
    const baseRole = role;
    const reqBody = req.body;
    var event_id;
    var option = reqBody.option;

    const requestParameterFeilds = ["event_name", "limit", "option"];
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

    var response;
    var options;
    if (role == "reporter" || (option && option == "self")) {
      options = {
        where: { event_id, user_id: id, user_type: baseRole },
        attributes: ["data"],
        include: {
          model: Audience,
          as: "audience",
          attributes: ["name", "email", "mobile", "address"],
        },
      };
      if (reqBody.limit !== undefined && reqBody.limit !== null) {
        options.limit = parseInt(req.body.limit, 10);
      }
    } else {
      options = {
        where: { event_id },
        attributes: ["data"],
        include: {
          model: Audience,
          as: "audience",
          attributes: ["name", "email", "mobile", "address"],
        },
      };
      if (reqBody.limit !== undefined && reqBody.limit !== null) {
        options.limit = parseInt(req.body.limit, 10);
      }
    }
    try {
      response = await Reporter_survey.findAll(options);
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
    if (response) {
      response = response.map((res) => res.toJSON());
    }
    return res.status(200).json(createApiResponse(response, 200));
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

      response = await Reporter_survey.findAll(options);
      if (response) {
        response = response.map((res) => res.toJSON());
      }
      if (!response[0]) {
        return res
          .status(200)
          .json(createApiResponse({ response: "no feedback" }, 200));
      }

      // response send to generateReport for generating report

      response = response.map((res) => res.data);
      var data = { feedback: response };

      response = await Report.create({
        event_id,
        user_id: id,
        user_type: role,
        report_type: "reporter",
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
  //   async getReport(req, res) {}
}
