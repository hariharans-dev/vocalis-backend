import express from "express";
import RoleController from "../controller/role.js";
import authMiddleware from "../middleware/authentication.js";
import adminMiddleware from "../middleware/admin.js";

const roleRouter = express.Router();
const rolecontroller = new RoleController();

roleRouter.post("/get", authMiddleware, rolecontroller.get);
roleRouter.post("/", authMiddleware, rolecontroller.register);
// roleRouter.delete("/", rolecontroller.delete);
roleRouter.post("/list", authMiddleware, rolecontroller.getUserRole);
roleRouter.get("/rolelist", authMiddleware, rolecontroller.getRole);
roleRouter.post("/rolelist", adminMiddleware, rolecontroller.createRole);

export default roleRouter;
