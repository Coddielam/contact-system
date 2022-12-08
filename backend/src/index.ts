import express from "express";
import apiContacts from "./routes/contacts.routes";
import apiTags from "./routes/tags.routes";
import mongoose from "mongoose";
import errorHandler from "./middlewares/error";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

(async function connectMongo() {
  console.log("host:", process.env.HOST);
  try {
    await mongoose.connect(`mongodb://${process.env.HOST}:27017/`, {
      dbName: "contacts-system",
      user: "root",
      pass: "example",
    });
    console.log("connected to mongo");
  } catch (error) {
    console.error(error);
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
