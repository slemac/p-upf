import express, { json, Application, Request, Response } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import cors from "cors";
import dbConnection from "./database";
import authRoute from "../routes/auth.route";
import { errorHandler } from "../middlewares";
import { NotFoundError } from "../errors";

class Server {
  public app: Application;
  private port: number;
  private apiPaths = {
    auth: "/api/auth",
  };

  constructor() {
    this.app = express();
    this.app.set("trust proxy", true);
    this.port = 4025;
    this.middlewares();
    this.routes();
  }

  async dataBase() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());
    // bodyParser
    this.app.use(json());
    this.app.use(
      cookieSession({
        signed: false,
        // secure: true,
        secure: process.env.NODE_ENV !== "test",
      })
    );
  }
  routes() {
    this.app.use(this.apiPaths.auth, authRoute);
    this.app.all("*", async (req: Request, res: Response) => {
      throw new NotFoundError();
    });
    this.app.use(errorHandler);
  }
  start() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }
}

export default Server;
