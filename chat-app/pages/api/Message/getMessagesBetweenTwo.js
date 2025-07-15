import connectToDatabase from "../../../config/mongoose";
import MessageModel from "../../../models/MessageModel";
import { jwtVerify } from "jose";

export default async function GetMessagesBetweenTwo(req, res) {
  if (req.method === "POST") {
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
      const { userToChatId } = req.body;
      await connectToDatabase();
      let messages = await MessageModel.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });
      res.status(200).json({ message: "Success", messages });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
