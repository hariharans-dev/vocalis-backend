import createApiResponse from "../utility/httpResponse.js";

const frontendMiddleware = async (req, res, next) => {
  const header = req.header("Authorization")?.split(" ");

  if (!header) {
    return res
      .status(401)
      .json(createApiResponse("missing authentication header", 401));
  }

  const authenticationToken = header[1];

  if (authenticationToken != process.env.FRONTEND_SECRET) {
    return res.status(401).json(createApiResponse("unauthorized access", 401));
  }
  next();
};

export default frontendMiddleware;
