import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

export default mongoose.model("Tag", tagSchema);
