import createApiResponse from "../utility/httpResponse.js";
import { requestValidation } from "../utility/requestValidation.js";
import "../models/Subscription/SubscriptionAssociation.js";
import Subscription from "../models/Subscription/Subscription.js";
import Subscription_plan from "../models/Subscription/Subscription_plan.js";

export default class SubscriptionController {
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
    const requiredFeilds = ["subscription_plan_name"];
    const validation = requestValidation(requiredFeilds, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }

    try {
      var plan = await Subscription_plan.findOne({
        where: { name: reqBody.subscription_plan_name },
        attributes: {
          exclude: ["name", "description", "createdAt", "updatedAt"],
        },
      });

      var resBody = {};
      if (token) {
        resBody = { token: token };
      }
      if (!plan) {
        resBody = { ...resBody, response: "no plan found" };
        return res.status(400).json(createApiResponse(resBody, 400));
      }

      plan = plan.toJSON();
      console.log(plan);
      const planId = plan.id;
      await Subscription.create({
        root_id: id,
        subscription_plan_id: planId,
        remaining_request: plan.request,
      });
      resBody = { ...resBody, response: "subscription created" };
      return res.status(200).json(createApiResponse(resBody, 200));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async get(req, res) {
    const id = req.middleware.id;
    const role = req.middleware.role;
    if (role != "root") {
      return res
        .status(403)
        .json(createApiResponse({ response: "restricted content" }, 403));
    }
    const token = req.middleware.token;

    try {
      var response = await Subscription.findAll({
        where: { root_id: id },
        attributes: {
          exclude: [
            "id",
            "root_id",
            "subscription_plan_id",
            "createdAt",
            "updatedAt",
          ],
        },
        include: {
          model: Subscription_plan,
          as: "subscription_plan",
          attributes: ["request", "name", "description"],
        },
      });
      response = response.map((plan) => plan.toJSON());
      var resBody = { subscription: response };
      if (token) {
        resBody = { ...resBody, token: token };
      }
      return res.status(201).json(createApiResponse(resBody, 200));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async getPlan(req, res) {
    try {
      var response = await Subscription_plan.findAll({
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });
      if (!response) {
        return res
          .status(201)
          .json(createApiResponse({ subscription_plan: {} }, 201));
      }
      response = response.map((plan) => plan.toJSON());
      return res
        .status(201)
        .json(createApiResponse({ subscription_plan: response }, 201));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(createApiResponse({ response: "internal server error" }, 500));
    }
  }
  async createPlan(req, res) {
    const reqBody = req.body;
    const requiredFeild = ["name", "request", "description", "price"];
    const validation = requestValidation(requiredFeild, reqBody);
    if (!validation) {
      return res
        .status(400)
        .json(createApiResponse({ response: "required feilds missing" }, 400));
    }
    const name = reqBody.name;
    const request = reqBody.request;
    const description = reqBody.description;
    const price = reqBody.price;

    try {
      await Subscription_plan.create({ name, request, description, price });
      return res
        .status(200)
        .json(
          createApiResponse({ response: "subscription plan created" }, 200)
        );
    } catch (error) {
      if (error.name == "SequelizeUniqueConstraintError") {
        return res
          .status(409)
          .json(createApiResponse({ response: "data duplication" }, 409));
      } else {
        return res
          .status(500)
          .json(createApiResponse({ response: "internal server error" }, 500));
      }
    }
  }
}
