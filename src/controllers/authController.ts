import { Request, Response } from "express";
import UsersModel from "../models/usersModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ error: "name, email and password required" });
    }

    const user = await UsersModel.findOne({ email });
    if (user) {
      return res.status(422).json({ error: "email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    await new UsersModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    return res
      .status(201)
      .json({ message: "Signup success, you can login now." });
  } catch (error) {
    return res.status(400).json({ error: "internal server error: " + error });
  }
};

export const signinUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "email and password required" });
    }

    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "invalid user" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res.status(401).json({ error: "invalid Email and Password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_AUTH_SERVICE as string,
    );

    return res.status(200).json({
      token,
      message: "Login success",
    });
  } catch (error) {
    return res.status(400).json({ error: "internal server error: " + error });
  }
};

export const testProtected = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    return res
      .status(200)
      .json({ message: "Access in protected resources", user: req.user });
  } catch (error) {
    return res.status(400).json({ error: "internal server error: " + error });
  }
};

export const testUnProtected = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    return res
      .status(200)
      .json({ message: "Access in Un-protected resources", user: req.user });
  } catch (error) {
    return res.status(400).json({ error: "internal server error: " + error });
  }
};
