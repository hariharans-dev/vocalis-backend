import express from "express";

import RootController from "../controller/root.js";
import authMiddleware from "../middleware/authentication.js";
import onetimeuseMiddleware from "../middleware/onetimeuse.js";

const rootRouter = express.Router();
const rootcontroller = new RootController();

rootRouter.post("/register", rootcontroller.register);
rootRouter.put("/", authMiddleware, rootcontroller.update);
rootRouter.delete("/", onetimeuseMiddleware, rootcontroller.delete);
rootRouter.post("/get", authMiddleware, rootcontroller.get);
rootRouter.post("/forgetpassword", rootcontroller.forgetpassword);
rootRouter.put(
  "/forgetpassword",
  onetimeuseMiddleware,
  rootcontroller.forgetpasswordvalidation
);

export default rootRouter;
