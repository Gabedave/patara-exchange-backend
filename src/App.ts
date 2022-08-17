/* eslint-disable */
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import helmet from "helmet";
import * as logger from "morgan";

import { v4 as uuidv4 } from "uuid";
import { MongoDbService } from "./lib/DB";
import handleAppError from "./lib/Errors/AppErrorHandler";
require("log-timestamp");

import initialiseEnvVar from "./utils/initialiseEnvVariables";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    initialiseEnvVar();

    this.app.use("/static", express.static(__dirname + "/public"));

    Promise.resolve(
      MongoDbService.connectMongo({ dbName: process.env.MONGO_URI })
    );

    this.app.use(logger("dev"));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors());
  }

  public routes(): void {
    let router: express.Router = express.Router();

    this.app.use("/check-health", (req, res) => {
      res.send({ message: "healthy" });
    });

    // set request id
    this.app.use((req, res, next) => {
      const requestId = uuidv4();
      console.log("Setting requestId", requestId);

      (req as any).request_id = requestId;
      next();
    });

    // this.app.use("/gen", AuthService.verifyUserToken, GeneralRouter);

    //   error handler middleware
    this.app.use((err, req, res, next) => {
      handleAppError(err, req, res);
    });
  }
}

export default App;
