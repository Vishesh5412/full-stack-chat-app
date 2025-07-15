import mongoose from "mongoose";
const GlobalMessageSchema = new mongoose.Schema(
  {
    senderId: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      type: String,
      required: true,
    },
    senderName: {
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
const GlobalMessageModel =
  mongoose.models.globalMessage ||
  mongoose.model("globalMessage", GlobalMessageSchema);
export default GlobalMessageModel;
