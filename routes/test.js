import express from "express";
import TestController from "../controller/test.js";

const testRouter = express.Router();
const testcontroller = new TestController();

// rootRouter.use(authMiddleware);

testRouter.get("/", testcontroller.get);

export default testRouter;
