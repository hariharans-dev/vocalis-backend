import bcrypt from "bcrypt";
import createApiResponse from "../utility/httpResponse.js";
import {
  requestValidation,
  requestParameter,
} from "../utility/requestValidation.js";
import "../models/User/UserAssociation.js";
import User from "../models/User/User.js";
import User_credential from "../models/User/User_credential.js";
import { createJWT } from "../utility/createJWT.js";
import { sendEmail } from "../utility/emailsender.js";

export default class UserController {
  async get(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "user") {
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
      var data = await User.findOne({
        where: { id: id },
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      data = data.toJSON();
      resBody = { ...resBody, ...data };
      return res.status(201).json(createApiResponse(resBody, 201));
    } catch (error) {
      console.log("user.js error1: ", error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async register(req, res) {
    const reqBody = req.body;

    const requiredFeilds = ["email", "password"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
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
      console.log("user.js error2: ", error);
      if (error.name == "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(createApiResponse({ response: "email already exists" }, 409));
      } else {
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }));
      }
    }
  }
  async update(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "user") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    const token = req.middleware.token;

    const reqBody = req.body;
    console.log(reqBody);
    const requiredFeild = ["name", "phone", "email", "password"];
    const validation = requestParameter(requiredFeild, reqBody);
    console.log(validation);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "undefined feilds found" }, 400));
    }

    try {
      if (reqBody["password"]) {
        const password = await bcrypt.hash(req.body.password, 10);
        await User_credential.update({ password }, { where: { user_id: id } });
        return res
          .status(201)
          .json(createApiResponse({ response: "password updated" }, 201));
      } else {
        await User.update(reqBody, { where: { id: id } });
        if (token) {
          return res.status(201).json(createApiResponse({ token: token }, 201));
        }
        return res
          .status(201)
          .json(createApiResponse({ response: "update successfull" }, 201));
      }
    } catch (error) {
      console.log("user.js error3: ", error);
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
    if (role != "user") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    // const token = req.middleware.token;

    try {
      await User.destroy({ where: { id: id } });

      return res
        .status(201)
        .json(createApiResponse({ response: "user deleted successful" }, 201));
    } catch (error) {
      console.log("user.js error4: ", error);
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
      var data = await User.findOne({
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
      const encodedToken = encodeURIComponent(token);

      const link =
        "" +
        process.env.FRONTEND_FORGETPASSWORD +
        "?key=" +
        encodedToken +
        "&role=user";
      await sendEmail(
        email,
        "Forgetpassword from " + process.env.WEBSITE,
        link
      );

      return res.json(
        createApiResponse({ response: "forgetpassword email sent" }, 201)
      );
    } catch (error) {
      console.log("user.js error5: ", error);
      return res
        .status(500)
        .json(createApiResponse("internal server error", 500));
    }
  }
  async forgetpasswordvalidation(req, res) {
    const reqBody = req.body;

    if (!reqBody.password) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

    const password = await bcrypt.hash(reqBody.password, 10);
    const id = req.middleware.id;

    try {
      await User_credential.update(
        { password: password },
        { where: { user_id: id } }
      );

      return res
        .status(201)
        .json(createApiResponse({ response: "password changed" }, 201));
    } catch (error) {
      console.log("user.js error6: ", error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
}
