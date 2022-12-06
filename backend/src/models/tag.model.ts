import mongoose, { Schema } from "mongoose";

export type TTag = {
  _id: mongoose.Types.ObjectId;
  name: string;
  contacts: [mongoose.Types.ObjectId];
};

const tagSchema = new mongoose.Schema<TTag>({
  name: String,
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

export default mongoose.model("Tag", tagSchema);
