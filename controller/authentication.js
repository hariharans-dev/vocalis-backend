import bcrypt from "bcrypt";
import { requestValidation } from "../utility/requestValidation.js";
import createApiResponse from "../utility/httpResponse.js";
import { createJWT } from "../utility/createJWT.js";

import "../models/Root/RootAssociation.js";
import "../models/User/UserAssociation.js";

import Root from "../models/Root/Root.js";
import Root_credential from "../models/Root/Root_credential.js";
import User from "../models/User/User.js";
import User_credential from "../models/User/User_credential.js";

export default class AuthenticationController {
  async rootlogin(req, res) {
    const reqBody = req.body;
    const requiredFeilds = ["email", "password"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

    const email = reqBody.email;
    const password = reqBody.password;

    try {
      var response = await Root.findOne({
        where: { email: email },
        attributes: {
          exclude: ["email", "createdAt", "updatedAt", "name", "phone"],
        },
        include: [
          {
            model: Root_credential,
            as: "root_credential",
            attributes: ["password"],
          },
        ],
      });
      if (!response) {
        return res
          .status(401)
          .json(createApiResponse({ response: "user not found" }, 401));
      }
      response = response.toJSON();

      const rootpassword = response.root_credential.password;
      const passwordMatch = bcrypt.compareSync(password, rootpassword);
      if (!passwordMatch) {
        return res
          .status(401)
          .json(createApiResponse({ response: "user not found" }, 401));
      }

      const id = response.id;
      const role = "root";
      const token = await createJWT(id, role);

      return res.status(201).json(createApiResponse({ token: token }, 200));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async userlogin(req, res) {
    const reqBody = req.body;
    const requiredFeilds = ["email", "password"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

    const email = reqBody.email;
    const password = reqBody.password;

    try {
      var response = await User.findOne({
        where: { email: email },
        attributes: ["id"],
        include: {
          model: User_credential,
          as: "user_credential",
          attributes: ["password"],
        },
      });
      if (!response) {
        return res
          .status(401)
          .json(createApiResponse({ response: "user not found" }, 401));
      }
      response = response.toJSON();

      const userpassword = response.user_credential.password;
      const passwordMatch = bcrypt.compareSync(password, userpassword);
      if (!passwordMatch) {
        return res
          .status(401)
          .json(createApiResponse({ response: "user not found" }, 401));
      }

      const id = response.id;
      const role = "user";
      const token = await createJWT(id, role);
      return res.status(201).json(createApiResponse({ token: token }));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async logout(req, res) {
    return res
      .status(201)
      .json(createApiResponse({ response: "logout successful" }, 201));
  }
  async session(req, res) {
    return res
      .status(201)
      .json(createApiResponse({ response: "session is active" }, 201));
  }
}
