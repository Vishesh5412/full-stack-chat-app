import * as cookie from "cookie";

import UserModel from "../../../models/UserModel";
import connectToDatabase from "../../../config/mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function LoginUser(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  await connectToDatabase();
  const { userData } = req.body;
  const { email, password } = userData;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
      algorithm: "HS256", // Explicit algorithm
    });
    let serialized;
    try {
      serialized = cookie.serialize("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hour in seconds
        path: "/",
      });
    } catch (error) {
      console.error("Cookie serialization error:", error);
      throw error; // or handle accordingly
    }
    const userObject = user.toObject();
    delete userObject.password;
    res.setHeader("Set-Cookie", serialized);
    console.log("Login succcessful");
    res.status(201).json({ message: "success", userObject });
  } catch (error) {
    console.log("Authentication", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
