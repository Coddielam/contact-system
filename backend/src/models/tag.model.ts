import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema({
  name: String,
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Contact",
    },
  ],
});

export default mongoose.model("Tag", tagSchema);
