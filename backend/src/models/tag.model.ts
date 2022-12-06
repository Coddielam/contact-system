import mongoose, { Schema } from "mongoose";

export type TTag = {
  _id: mongoose.Types.ObjectId;
  name: string;
};

const tagSchema = new mongoose.Schema<TTag>({
  name: String,
});

export default mongoose.model("Tag", tagSchema);
