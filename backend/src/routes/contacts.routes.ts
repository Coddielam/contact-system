import express, { Express } from "express";
import {
  findContact,
  findAllContacts,
  createContact,
  updateContact,
  deleteContact,
  uploadContact,
  downloadContact,
} from "../controllers/contacts.controller";
import checkParamId from "../middlewares/checkParamId";
import multer from "multer";
import path from "path";

export default function (app: Express) {
  const contactsRouter = express.Router();

  // get all the contacts
  contactsRouter.get("/all", findAllContacts);

  // create a contact
  contactsRouter.post("/create", createContact);

  // get a specific contact
  contactsRouter.get("/:id", checkParamId, findContact);

  // update a contact
  contactsRouter.patch(
    "/:id/update",
    checkParamId,
    // accept max of 5 vcards per requests
    updateContact
  );
  // delete one or more contacts
  contactsRouter.delete("/:id/delete", checkParamId, deleteContact);

  // upload one or more of vcf
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/upload/vcards");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });
  contactsRouter.post("/upload", upload.array("contacts", 5), uploadContact);
  // download one or more contacts
  contactsRouter.get("/download", downloadContact);

  app.use("/api/contacts", contactsRouter);
}
