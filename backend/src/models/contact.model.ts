import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phones: [Number],
  addresses: [String],
  emails: [String],
  orgName: String,
  websiteUrl: String,
  notes: String,
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

export default mongoose.model("Contact", contactSchema);
