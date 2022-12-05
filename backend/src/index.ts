import express from "express";
import apiContacts from "./routes/contacts.routes";
import apiTags from "./routes/tags.routes";
import mongoose from "mongoose";
import errorHandler from "./middlewares/error";
import cors from "cors";

const app = express();

(async function connectMongo() {
  try {
    await mongoose.connect(`mongodb://localhost:27017/`, {
      dbName: "contacts-system",
      user: "root",
      pass: "example",
    });
    console.log("connected to mongo");
  } catch (error) {
    console.error("failed to connect");
  }
})();

app.use(cors());
app.use(express.json());
// /api/contacts
apiContacts(app);
// /api/tags
apiTags(app);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`>>> backend listening on http://localhost:${PORT}`);
});

// import fs from "fs";
// import path from "path";
// import { MyVCard } from "./lib/MyVCard";

// const vcardsPath = path.join(__dirname, "./lib/vcards.vcf");
// const result = new MyVCard().parseToObject(
//   fs.readFileSync(vcardsPath).toString().replace(/\r?\n/g, "\r\n")
// );

// console.log(result);
