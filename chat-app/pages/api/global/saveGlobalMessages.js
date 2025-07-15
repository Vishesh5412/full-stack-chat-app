import connectToDatabase from "../../../config/mongoose";
import GlobalMessageModel from "../../../models/GlobalMessageModel";
import UserModel from "../../../models/UserModel";
import cloudinary from "../../../lib/cloudinary";
import { jwtVerify } from "jose";

import nextConnect from "next-connect";
import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "/tmp" });

// Tell Next.js to disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();

handler.use(upload.single("file"));

handler.post(async (req, res) => {
  if (req.method === "POST") {
    await connectToDatabase();
    const token = req.cookies.authToken;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { payload } = await jwtVerify(token, secret);
      const myId = payload.userid;
      if (!myId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      let user = await UserModel.findById(myId);
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { message } = req.body;
      let imageUrl = "";
      if (req.file) {
        const response = await cloudinary.uploader.upload(req.file.path);
        imageUrl = response.secure_url;
      }
      const newMessage = await GlobalMessageModel.create({
        senderId: myId,
        senderName: user.name,
        content: message,
        imageUrl,
      });

      // io.to(when use in server side) send message to all  clients in room
      const roomId = "global-room";
      if (res.socket.server.io) {
        res.socket.server.io.to(roomId).emit("globalMessage", newMessage);
      }

      res.status(200).json({ message: "Success", newMessage });
    } catch (err) {
      console.log("Cannot save message", err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
export default handler;
