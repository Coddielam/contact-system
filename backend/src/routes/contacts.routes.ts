import express, { Express } from "express";
import {
  findContact,
  findAllContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contacts.controller";

export default function (app: Express) {
  const contactsRouter = express.Router();

  // get a specific contact
  contactsRouter.get("/:id", findContact);
  // get all the contacts
  contactsRouter.get("/all", findAllContacts);

  // create a contact
  contactsRouter.post("/create", createContact);
  // update a contact
  contactsRouter.patch("/:id/update", updateContact);
  // delete one or more contacts
  contactsRouter.delete("/:id/delete", deleteContact);

  // TODO: add controllers
  // upload one or more of vcf
  contactsRouter.post("/upload");
  // download one or more contacts
  contactsRouter.get("/download");

  app.use("/api/contacts", contactsRouter);
}
