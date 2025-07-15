import connectToDatabase from "../../../config/mongoose";
import globalMessageModel from '../../../models/GlobalMessageModel'
import { jwtVerify } from "jose";

export default async function GetMessagesBetweenTwo(req, res) {
  if (req.method === "GET") {
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
      await connectToDatabase();
      let messages = await globalMessageModel.find({});
      res.status(200).json({ message: "Success", messages });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
