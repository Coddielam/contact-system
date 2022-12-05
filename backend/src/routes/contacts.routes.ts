import express, { Express } from "express";
import {
  findContact,
  findAllContacts,
  createContact,
  updateContact,
  deleteContact,
  downloadContact,
} from "../controllers/contacts.controller";
import checkParamId from "../middlewares/checkParamId";

export default function (app: Express) {
  const contactsRouter = express.Router();

  // get all the contacts
  contactsRouter.get("/all", findAllContacts);

  // create a contact
  contactsRouter.post("/create", createContact);

  // get a specific contact
  contactsRouter.get("/:id", checkParamId, findContact);

  // update a contact
  contactsRouter.patch("/:id/update", checkParamId, updateContact);
  // delete one or more contacts
  contactsRouter.delete("/:id/delete", checkParamId, deleteContact);

  // TODO: add controllers
  // upload one or more of vcf
  contactsRouter.post("/upload");
  // download one or more contacts
  contactsRouter.get("/download", downloadContact);

  app.use("/api/contacts", contactsRouter);
}
