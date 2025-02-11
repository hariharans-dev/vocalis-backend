import bcrypt from "bcrypt";
import createApiResponse from "../utility/httpResponse.js";
import { requestValidation } from "../utility/requestValidation.js";
import { User, User_credential } from "../models/User/UserAssociation.js";
import { createJWT } from "../utility/createJWT.js";

export default class UserController {
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
  async get(req, res) {}
  async update(req, res) {}
  async delete(req, res) {}
}
