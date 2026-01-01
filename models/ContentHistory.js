import { Schema, model } from "mongoose";

const historySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


//! Compile to form the model
const ContentHistory = model("ContentHistory", historySchema);
export default ContentHistory;
