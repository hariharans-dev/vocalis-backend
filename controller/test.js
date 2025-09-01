import createApiResponse from "../utility/httpResponse.js";

export default class TestController {
  async get(req, res) {
    return res.status(200).json(createApiResponse({ response: "test" }, 200));
  }
}
