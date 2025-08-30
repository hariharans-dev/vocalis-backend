import express from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import ReporterController from "../controller/reporterSurvey.js";
import authMiddleware from "../middleware/authentication.js";
import createApiResponse from "../utility/httpResponse.js";

// Storage with unique filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const uniqueName = `${baseName}-${Date.now()}-${uuidv4()}${ext}`;

    req.body.file = uniqueName; // keep track for controller use
    cb(null, uniqueName);
  },
});

// File filter for audio types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "audio/mpeg" ||
    file.mimetype === "audio/mp3" ||
    file.mimetype === "audio/webm" ||
    file.mimetype === "video/webm"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .mp3 or .webm files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

const reporterRouter = express.Router();
const reporterController = new ReporterController();

// Upload route (expects a single file named "file")
reporterRouter.post(
  "/data",
  upload.single("file"),
  authMiddleware,
  reporterController.createData,
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json(createApiResponse({ response: err.message }, 400));
    } else if (err) {
      return res
        .status(400)
        .json(createApiResponse({ response: err.message }, 400));
    }
    next();
  }
);

// Other routes
reporterRouter.post("/data/get", authMiddleware, reporterController.getData);
reporterRouter.post("/report", authMiddleware, reporterController.createReport);
reporterRouter.post(
  "/report/get",
  authMiddleware,
  reporterController.getReport
);

export default reporterRouter;
