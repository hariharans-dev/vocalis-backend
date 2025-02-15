import bcrypt from "bcrypt";
import createApiResponse from "../utility/httpResponse.js";
import {
  requestValidation,
  requestParameter,
} from "../utility/requestValidation.js";
import { createJWT } from "../utility/createJWT.js";
import { sendEmail } from "../utility/emailsender.js";
import "../models/Root/RootAssociation.js";
import Root from "../models/Root/Root.js";
import Root_credential from "../models/Root/Root_credential.js";

export default class RootController {
  async get(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "root") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    const token = req.middleware.token;
    var resBody = {};
    if (token) {
      resBody = { ...resBody, token: token };
    }

    try {
      var data = await Root.findOne({
        where: { id: id },
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      if (data == null) {
        return res
          .status(404)
          .json(createApiResponse({ response: "root not found" }, 404));
      }
      data = data.toJSON();
      resBody = { ...resBody, ...data };

      return res
        .status(201)
        .json(createApiResponse({ root_data: resBody }, 201));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse("internal server error", 500));
    }
  }
  async register(req, res) {
    const reqBody = req.body;

    const requiredFeild = ["email", "password"];
    const validation = requestValidation(requiredFeild, reqBody);

    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

    const email = reqBody.email;
    const password = await bcrypt.hash(reqBody.password, 10);

    try {
      var response = await Root.create(
        { email: email, root_credential: { password: password } },
        { include: { model: Root_credential, as: "root_credential" } }
      );
      response = response.toJSON();
      const id = response.id;
      const role = "root";

      const token = await createJWT(id, role);

      res
        .status(200)
        .json(
          createApiResponse(
            { token: token, response: "root user registered" },
            200
          )
        );
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(createApiResponse({ response: "email exists" }, 409));
      } else {
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
    }
  }
  async update(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "root") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    const token = req.middleware.token;

    const reqBody = req.body;
    const requiredFeild = ["name", "phone", "email"];
    const validation = requestParameter(requiredFeild, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "undefined feilds" }, 400));
    }

    try {
      await Root.update(reqBody, { where: { id: id } });
      if (token) {
        return res
          .status(201)
          .json(
            createApiResponse(
              { token: token, response: "update successful" },
              201
            )
          );
      }
      return res
        .status(201)
        .json(createApiResponse({ response: "update successfull" }, 201));
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(
            createApiResponse({ response: "phone number already exists" }, 409)
          );
      } else {
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
    }
  }
  async delete(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "root") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    try {
      await Root.destroy({
        where: { id: id },
      });
      // const response = await Root_credential.findAll({});
      // console.log(response);

      return res
        .status(201)
        .json(createApiResponse({ response: "root deleted successful" }, 201));
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async forgetpassword(req, res) {
    const reqBody = req.body;
    const email = reqBody.email;
    if (!email) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }
    try {
      var data = await Root.findOne({
        where: { email: email },
        attributes: {
          exclude: ["email", "name", "phone", "createdAt", "updatedAt"],
        },
      });
      if (!data) {
        return res
          .status(404)
          .json(createApiResponse({ response: "email not registered" }, 404));
      }
      data = data.toJSON();
      const token = await createJWT(data.id, "forgetpassword");

      const link = "" + process.env.FRONTEND_FORGETPASSWORD + "?key=" + token;
      await sendEmail(
        email,
        "Forgetpassword from " + process.env.WEBSITE,
        link
      );

      return res.json(
        createApiResponse({ response: "forgetpassword email sent" }, 201)
      );
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse("internal server error", 500));
    }
  }
  async forgetpasswordvalidation(req, res) {
    const reqBody = req.body;
    const password = await bcrypt.hash(reqBody.password, 10);
    const id = req.middleware.id;

    try {
      await Root_credential.update(
        { password: password },
        { where: { root_id: id } }
      );

      return res
        .status(201)
        .json(createApiResponse({ response: "password changed" }, 201));
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
}
