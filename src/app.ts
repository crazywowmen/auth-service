import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import "./types/expressAugumentation";

dotenv.config();

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/api", authRoutes);

app.get("/api", (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message:
        "Welcome in AUTH Service, Enjoy the /signup & /signin POST routes.",
    });
});

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({
      message:
        "Welcome in AUTH Service, Enjoy the /api/signup & /api/signin POST routes.",
    });
});

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uxqvfsm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected with MongoDB");
  })
  .catch((err) => {
    console.log("Error in DB Connection: ", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App Started at port: ", PORT);
});
