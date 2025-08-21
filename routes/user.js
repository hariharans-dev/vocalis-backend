import express from "express";
import UserController from "../controller/user.js";
import authMiddleware from "../middleware/authentication.js";
import onetimeuseMiddleware from "../middleware/onetimeuse.js";

const userRouter = express.Router();
const usercontroller = new UserController();

// rootRouter.use(authMiddleware);

userRouter.post("/register", usercontroller.register);
userRouter.post("/get", authMiddleware, usercontroller.get);
userRouter.put("/", authMiddleware, usercontroller.update);
userRouter.delete("/", onetimeuseMiddleware, usercontroller.delete);
userRouter.post("/forgetpassword", usercontroller.forgetpassword);
userRouter.put(
  "/forgetpassword",
  onetimeuseMiddleware,
  usercontroller.forgetpasswordvalidation
);

export default userRouter;
