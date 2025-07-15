import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";
import { jwtVerify } from "jose";
import cloudinary from "../../../lib/cloudinary";
import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/UserModel";

const upload = multer({ dest: "/tmp" });
// it means to save images in a temperarory way in /tmp directory before begin uplaoding

// Tell Next.js to disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

// Setup handler using next-connect
const handler = nextConnect();

handler.use(upload.single("file")); // 'file' is the field name

handler.patch(async (req, res) => {
  const token = req.cookies.authToken;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userid;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await connectToDatabase();
    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });
    const { about } = req.body;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path); // Clean up temp file
      user.imageUrl = result.secure_url;
    }
    // Save URL in DB
    user.about = about;
    await user.save();

    res.status(200).json({ message: "Success", updatedUser: user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default handler;
