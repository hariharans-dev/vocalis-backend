import createApiResponse from "../utility/httpResponse.js";

const adminMiddleware = async (req, res, next) => {
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

  if (authenticationToken != process.env.ADMIN_SECRET) {
    return res.status(401).json(createApiResponse("unauthorized access", 401));
  }
  next();
};

export default adminMiddleware;
