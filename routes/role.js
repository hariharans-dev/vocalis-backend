import express from "express";
import RoleController from "../controller/role.js";
import authMiddleware from "../middleware/authentication.js";

const roleRouter = express.Router();
const rolecontroller = new RoleController();

roleRouter.post("/get", authMiddleware, rolecontroller.get);
roleRouter.post("/", authMiddleware, rolecontroller.register);
roleRouter.delete("/", authMiddleware, rolecontroller.delete);
roleRouter.post("/list", authMiddleware, rolecontroller.getUserRole);
roleRouter.post("/event/list", authMiddleware, rolecontroller.getEventRole);

roleRouter.get("/rolelist", rolecontroller.getRole);
roleRouter.post("/rolelist", authMiddleware, rolecontroller.createRole);

export default roleRouter;
