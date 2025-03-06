import jwt from "jsonwebtoken";

import createApiResponse from "../utility/httpResponse.js";
import { getKey } from "../db/redis_connection.js";
import { refreshJWT } from "../utility/createJWT.js";

const authMiddleware = async (req, res, next) => {
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
      .json(
        createApiResponse({ response: "missing authentication header" }, 401)
      );
  }

  const authenticationToken = header[1];
  try {
    const data = jwt.decode(authenticationToken, process.env.JWT_SECRET);
    if (data == null) {
      throw new Error("Null Error");
    }

    const redisId = data.id;
    const createdAt = data.createdAt;

    var redisData = await getKey(redisId);
    if (!redisData) {
      throw new Error("Null Error");
    }
    redisData = JSON.parse(redisData);

    var reqBody = {};
    reqBody = { id: redisData.id, role: redisData.role };
    const refresh = checkexpire(createdAt);

    if (refresh) {
      const token = await refreshJWT(redisId, redisData.id, redisData.role);
      reqBody.token = token;
    }
    req.middleware = reqBody;
    next();
  } catch (error) {
    console.log("middleware authentication.js error1: ", error);
    return res
      .status(403)
      .json(
        createApiResponse({ response: "invalid authentication token" }, 403)
      );
  }
};

const checkexpire = (createdAt) => {
  const currentTime = Date.now();
  const diff = Math.floor((currentTime - createdAt) / 60000);
  const refresh_time = process.env.REFRESH_TIME * 60;
  return diff > refresh_time;
};

export default authMiddleware;
