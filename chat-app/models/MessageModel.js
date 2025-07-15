import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      type: String,
      required: true,
    },
    receiverId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const MessageModel =
  mongoose.models.message || mongoose.model("message", MessageSchema);
export default MessageModel;
