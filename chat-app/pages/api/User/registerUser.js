import * as cookie from "cookie";

import UserModel from "../../../models/UserModel";
import connectToDatabase from "../../../config/mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function RegisterUser(req, res) {
  if (req.method === "POST") {
    try {
      await connectToDatabase();
      const { userData } = req.body;
      const { name, email, password } = userData;
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All field are required" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }
      const registerUser = await UserModel.findOne({ email });
      if (registerUser) {
        console.log("User already exists");
        return res.status(409).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });
      const userObject = newUser.toObject();
      delete userObject.password;
      newUser._id = newUser._id.toString();
      const token = jwt.sign({ userid: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
        algorithm: "HS256",
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

      res.setHeader("Set-Cookie", serialized);

      console.log("User registration successful");
      res.status(201).json({ message: "Success", userObject });
    } catch (err) {
      console.log("Authentication error", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
