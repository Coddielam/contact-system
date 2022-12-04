import express, { Express } from "express";

export default function (app: Express) {
  const contactsRouter = express.Router();

  // get a specific contact
  contactsRouter.get("/:id");
  // get all the contacts
  contactsRouter.get("/all");

  // create a contact
  contactsRouter.post("/create");
  // update a contact
  contactsRouter.put("/update");
  // delete one or more contacts
  contactsRouter.delete("/delete");

  // upload one or more of vcf
  contactsRouter.post("/upload");
  // download one or more contacts
  contactsRouter.get("/download");

  app.use("/api/contacts", contactsRouter);
}
