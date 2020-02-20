import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morganLogger from "morgan";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import logger from "./utils/logger";
import { getValue } from "./config";
import cors from "cors";
import validate from "validate.js";
import { ObjectId } from "bson";

import Router from "./routes";

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
function mongoinit() {
  const db = getValue("dbURL");
  logger.info("DB", db);
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      logger.info("Connected to MONGODB", "app");
    })
    .catch(async err => {
      logger.error(err, "app");
      setTimeout(mongoinit, 3000);
    });
}
mongoinit();

const app = express();

app.set("trustproxy", 1);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(morganLogger("dev"));
app.use(cors());

app.use(Router);
app.use(
  (err: any, req: any, res: express.Response, next: express.NextFunction) => {
    logger.error(err.toString(), `${req.method} ${req.originalUrl}`);
    res.status(500).json({ description: err, success: false });
  }
);
// Custom validate.js validators
validate.validators.objectid = (value: any) => {
  return ObjectId.isValid(value) ? undefined : "Invalid ObjectId";
};

export default app;
