import express, { Express } from "express";
import {
  findAllTags,
  createTag,
  deleteTag,
  updateTags,
} from "../controllers/tags.controller";

export default function apiTags(app: Express) {
  const contactsRouter = express.Router();

  // get all the tags
  contactsRouter.get("/all", findAllTags);
  // create a tag
  contactsRouter.post("/create", createTag);
  // delete a tag
  contactsRouter.put("/delete", deleteTag);
  // update tags
  contactsRouter.patch("/update", updateTags);

  app.use("/api/tags", contactsRouter);
}
