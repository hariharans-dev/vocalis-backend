import bcrypt from "bcrypt";
import createApiResponse from "../utility/httpResponse.js";
import {
  requestValidation,
  requestParameter,
} from "../utility/requestValidation.js";
import { User, User_credential } from "../models/User/UserAssociation.js";
import { createJWT } from "../utility/createJWT.js";

export default class UserController {
  async get(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "user") {
      return res.status(403).json(createApiResponse("restricted content", 403));
    }
    const token = req.middleware.token;

    try {
      var resBody = {};
      var data = await User.findOne({
        where: { id: id },
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      data = data.toJSON();
      resBody = { ...resBody, ...data };
      if (token) {
        resBody.token = token;
      }
      return res.status(201).json(createApiResponse(resBody, 201));
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse("internal server error", 500));
    }
  }
  async register(req, res) {
    const reqBody = req.body;

    const requiredFeilds = ["email", "password"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse("required feilds missing", 400));
    }

    const email = reqBody.email;
    const password = await bcrypt.hash(req.body.password, 10);
    var response;

    try {
      response = await User.create(
        {
          email: email,
          user_credential: { password: password },
        },
        { include: { model: User_credential, as: "user_credential" } }
      );
      response = response.toJSON();
      const id = response.id;
      const role = "user";

      const token = await createJWT(id, role);

      return res.status(200).json(createApiResponse({ token: token }, 200));
    } catch (error) {
      if (error.name == "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(createApiResponse("email already exists", 409));
      } else {
        return res.status(500).json(createApiResponse("internal server error"));
      }
    }
  }
  async update(req, res) {
    console.log(req.middleware);
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "user") {
      return res.status(403).json(createApiResponse("restricted content", 403));
    }
    const token = req.middleware.token;

    const reqBody = req.body;
    const requiredFeild = ["name", "phone", "email"];
    const validation = requestParameter(requiredFeild, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse("undefined feilds found", 400));
    }

    try {
      await User.update(reqBody, { where: { id: id } });
      if (token) {
        return res.status(201).json(createApiResponse({ token: token }, 201));
      }
      return res.status(201).json(createApiResponse("update successfull", 201));
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(createApiResponse("phone number already exists", 409));
      } else {
        return res
          .status(500)
          .json(createApiResponse("internal server error", 500));
      }
    }
  }
  async delete(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "user") {
      return res.status(403).json(createApiResponse("restricted content", 403));
    }
    const token = req.middleware.token;

    try {
      await User.destroy({ where: { id: id } });

      return res
        .status(201)
        .json(createApiResponse("user deleted successful", 201));
    } catch (error) {
      return res
        .status(500)
        .json(createApiResponse("internal server error", 500));
    }
  }
}
