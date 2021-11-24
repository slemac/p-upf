import * as express from "express";

declare global {
  namespace Express {
    export interface Request {
      currentAccount: {
        id: string;
        iat: number;
      };
    }
  }
}
