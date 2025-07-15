import connectToDatabase from "../../../config/mongoose";
import UserModel from "../../../models/UserModel";
import { jwtVerify } from "jose";

export default async function GetUsersForSidebar(req, res) {
  if (req.method === "GET") {
    try {
      const token = req.cookies.authToken;
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { payload } = await jwtVerify(token, secret);
      const myId = payload.userid;
      if (!myId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      await connectToDatabase();
      let usersWithoutMe = await UserModel.find({
        _id: { $ne: myId },
      }).select("-password");
      res.status(200).json({ message: "Success", usersWithoutMe });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
