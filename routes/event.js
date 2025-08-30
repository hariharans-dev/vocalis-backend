import express from "express";
import EventController from "../controller/event.js";
import authMiddleware from "../middleware/authentication.js";

const eventRouter = express.Router();
const eventcontroller = new EventController();

eventRouter.post("/get", authMiddleware, eventcontroller.get);
eventRouter.post("/get/endpoint", eventcontroller.get);
eventRouter.post("/", authMiddleware, eventcontroller.register);
eventRouter.put("/", authMiddleware, eventcontroller.update);
eventRouter.delete("/", authMiddleware, eventcontroller.delete);

export default eventRouter;
