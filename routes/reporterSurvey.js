import express, { response } from "express";
import multer from "multer";
import ReporterController from "../controller/reporterSurvey.js";
import authMiddleware from "../middleware/authentication.js";
import createApiResponse from "../utility/httpResponse.js";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    req.body.file = file.originalname;
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/mp3") {
    cb(null, true);
  } else {
    cb(new Error("Only MP3 files are allowed!"), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const reporterRouter = express.Router();
const reportercontroller = new ReporterController();

reporterRouter.post(
  "/data",
  upload.any("file"),
  authMiddleware,
  reportercontroller.createData,
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json(createApiResponse({ response: err.message }, 400));
    } else if (err) {
      res.status(400).json(createApiResponse({ response: err.message }, 400));
    } else {
      next();
    }
  }
);
reporterRouter.get("/data", authMiddleware, reportercontroller.getData);
// reporterRouter.put("/", authMiddleware, eventcontroller.update);
// reporterRouter.delete("/", authMiddleware, eventcontroller.delete);

export default reporterRouter;
