import mongoose, { Schema } from "mongoose";
import { MyVCard } from "../lib/MyVCard";
export type TContact = {
  // _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  phones: number[];
  addresses: {
    line1: string;
    line2: string;
    line3: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  }[];
  emails: string[];
  orgName: string;
  websiteUrl: string;
  notes: string;
  tags: [mongoose.Types.ObjectId];
};

const contactSchema = new mongoose.Schema<TContact>({
  // _id: Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  phones: [Number],
  addresses: [
    {
      line1: String,
      line2: String,
      line3: String,
      city: String,
      state: String,
      postal: String,
      country: String,
    },
  ],
  emails: [String],
  orgName: String,
  websiteUrl: String,
  notes: String,
  tags: [
    {
      type: Schema.Types.Array,
      ref: "Tag",
      default: [],
    },
  ],
});

// methods
contactSchema.methods.generateVCF = function generateVCF() {
  const {
    firstName,
    lastName,
    phones,
    addresses,
    emails,
    orgName,
    websiteUrl,
    notes,
    tags,
  } = this;
  const obj = {
    firstName,
    lastName,
    phones,
    addresses,
    emails,
    orgName,
    websiteUrl,
    notes,
    tags,
  };
  const filePath = new MyVCard().createVCFFromDbObj(obj);
  return filePath;
};

export default mongoose.model("Contact", contactSchema);
