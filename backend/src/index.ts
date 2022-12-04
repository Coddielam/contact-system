import express from "express";
import apiContacts from "./routes/contacts.routes";
import apiTags from "./routes/tags.routes";
import mongoose from "mongoose";
import errorHandler from "./middlewares/error";

const app = express();

app.use(express.json());

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

// mount routes
// /api/contacts
apiContacts(app);
// /api/tags
apiTags(app);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`>>> backend listening on http://localhost:${PORT}`);
});
