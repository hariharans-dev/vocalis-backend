import {
  requestParameter,
  requestValidation,
} from "../utility/requestValidation.js";
import createApiResponse from "../utility/httpResponse.js";
import { voice_text } from "../utility/insights.js";

import "../models/Event/EventAssociation.js";
import Event from "../models/Event/Event.js";

import "../models/Role/RoleAssociation.js";
import Role from "../models/Role/Role.js";

import "../models/Survey//SurveyAssociation.js";
import Audience from "../models/Survey/Audience.js";
import Reporter_survey from "../models/Survey/Reporter_survey.js";

export default class ReporterController {
  async createData(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    const reqBody = req.body;

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
  //   async getData(req, res) {}
  //   async createReport(req, res) {}
  //   async getReport(req, res) {}
}
