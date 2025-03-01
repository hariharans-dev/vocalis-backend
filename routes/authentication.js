import express from "express";
import AuthenticationController from "../controller/authentication.js";
import authMiddleware from "../middleware/authentication.js";
import onetimeuseMiddleware from "../middleware/onetimeuse.js";

const authRouter = express.Router();
const authcontroller = new AuthenticationController();

// rootRouter.use(authMiddleware);

authRouter.post("/root", authcontroller.rootlogin);
authRouter.post("/user", authcontroller.userlogin);
authRouter.post("/root/google", authcontroller.rootgooglelogin);
authRouter.post("/user/google", authcontroller.usergooglelogin);
authRouter.delete("/", onetimeuseMiddleware, authcontroller.logout);
authRouter.get("/", authMiddleware, authcontroller.session);

export default authRouter;
