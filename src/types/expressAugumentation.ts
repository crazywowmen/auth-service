import { Request } from "express";

export {};

declare module "express" {
  interface Request {
    user?: string; // Or you can set a specific type if you have a User interface
  }
}
