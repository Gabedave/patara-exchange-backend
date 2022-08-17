"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");
const express = require("express");
const helmet_1 = require("helmet");
const logger = require("morgan");
const uuid_1 = require("uuid");
const DB_1 = require("./lib/DB");
const AppErrorHandler_1 = require("./lib/Errors/AppErrorHandler");
require("log-timestamp");
const initialiseEnvVariables_1 = require("./utils/initialiseEnvVariables");
class App {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }
    config() {
        initialiseEnvVariables_1.default();
        this.app.use("/static", express.static(__dirname + "/public"));
        Promise.resolve(DB_1.MongoDbService.connectMongo({ dbName: process.env.MONGO_URI }));
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(helmet_1.default());
        this.app.use(compression());
        this.app.use(cors());
    }
    routes() {
        let router = express.Router();
        this.app.use("/check-health", (req, res) => {
            res.send({ message: "healthy" });
        });
        // set request id
        this.app.use((req, res, next) => {
            const requestId = uuid_1.v4();
            console.log("Setting requestId", requestId);
            req.request_id = requestId;
            next();
        });
        // this.app.use("/gen", AuthService.verifyUserToken, GeneralRouter);
        //   error handler middleware
        this.app.use((err, req, res, next) => {
            AppErrorHandler_1.default(err, req, res);
        });
    }
}
exports.default = App;
