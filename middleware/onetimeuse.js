import jwt from "jsonwebtoken";

import createApiResponse from "../utility/httpResponse.js";
import { deleteKey, getKey } from "../db/redis_connection.js";

const onetimeuseMiddleware = async (req, res, next) => {
  var header;
  const authHeader = req.header("Authorization");

  if (authHeader) {
    header = authHeader.split(" ");
  } else {
    header = null;
  }
  if (!header) {
    return res
      .status(401)
      .json(createApiResponse("missing authentication header", 401));
  }

  const authenticationToken = header[1];

  try {
    const data = jwt.decode(authenticationToken, process.env.JWT_SECRET);
    if (data == null) {
      throw new Error("Data is null");
    }

    const redisId = data.id;

    var redisData = await getKey(redisId);

    if (!redisData) {
      throw error;
    }
    redisData = JSON.parse(redisData);

    await deleteKey(redisId);

    var reqBody = { id: redisData.id, role: redisData.role };
    req.middleware = reqBody;

    next();
  } catch (error) {
    return res
      .status(403)
      .json(createApiResponse("invalid authentication", 403));
  }
};

export default onetimeuseMiddleware;
