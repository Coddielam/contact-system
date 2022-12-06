import { RequestHandler } from "express";
import { Document } from "mongoose";
import { CustomError } from "../error";
import { MyVCard } from "../lib/MyVCard";
import { ContactModel } from "../models";
import { TContactReqBody } from "../types/contact";

import fs from "fs";

export const findContact: RequestHandler<
  { id: string },
  { contact: Document },
  {}
> = async (req, res, next) => {
  try {
    const contact = await ContactModel.findById(req.params.id);
    if (!contact) throw new Error("Contact does not exist");
    res.status(200).json({ contact });
  } catch (error) {
    next(error);
  }
};

export const findAllContacts: RequestHandler<
  {},
  { contacts: Document[] },
  {}
> = async (req, res, next) => {
  try {
    ContactModel.find;
    const contacts = await ContactModel.find({});
    res.status(200).json({ contacts });
  } catch (error) {
    next(error);
  }
};

export const createContact: RequestHandler<
  {},
  { contact: Document },
  TContactReqBody
> = async (req, res, next) => {
  try {
    // TODO: validate request body
    const { firstName, lastName, phones, addresses } = req.body;
    // validate
    const newContact = new ContactModel(req.body);
    const contact = await newContact.save();
    res.status(200).json({ contact });
  } catch (error) {
    next(error);
  }
};

export const updateContact: RequestHandler<
  { id: string },
  { contact: Document },
  TContactReqBody
> = async (req, res, next) => {
  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!updatedContact) throw new Error("Contact does not exist");
    res.status(200).json({ contact: updatedContact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact: RequestHandler<
  { id: string },
  { contact: Document },
  {}
> = async (req, res, next) => {
  // TODO: validate request body
  try {
    const deletedContact = await ContactModel.findByIdAndDelete(req.params.id);
    if (!deletedContact) throw new Error("Contact does not exist");
    res.status(200).json({ contact: deletedContact });
  } catch (error) {
    next(error);
  }
};

export const uploadContact: RequestHandler<{}, {}, {}> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.files?.length) throw new CustomError("No uploaded files", 400);

    const savedContacts = [];
    for (let i = 0; i < req.files!.length; i++) {
      const fileInfo = (req.files as Express.Multer.File[])[i];
      const content = fs.readFileSync(fileInfo.path).toString();
      const contactObjs = new MyVCard().parseToObject(content);

      const stripeNumber = (string: string) => {
        return Number(string.replace(/\D/g, ""));
      };

      // TODO: implement add, skip, update business logic
      /**
       * How to determine if the contact exists?
       * - skip: if the EXACT same contact exists in db
       * - update: if name + phone found
       * - add: if ! name + phone found
       * */

      for (let i = 0; i < contactObjs.length; i++) {
        const newContact = new ContactModel({
          firstName: contactObjs[i].name.name,
          lastName: contactObjs[i].name.surname,
          phones: contactObjs[i].phones.map((phoneStr) =>
            stripeNumber(phoneStr)
          ),
          addresses: contactObjs[i].adresses,
          emails: contactObjs[i].emails,
          orgName: contactObjs[i].org || "",
          websiteUrl: contactObjs[i].url || "",
          notes: contactObjs[i].note || "",
          tag: contactObjs[i]["x-tags"] || [], // either vcf has custom x-tags specified, no tags for by default
        });

        const savedContact = await newContact.save();
        savedContacts.push(savedContact);
      }
    }

    res.status(200).json({ uploadedContacts: savedContacts });
  } catch (error) {
    next(error);
  }
};

export const downloadContact: RequestHandler<
  {},
  {},
  { contactId: string }
> = async (req, res, next) => {
  try {
    const contact = await ContactModel.findById(req.body.contactId);
    if (!contact) throw new CustomError("Contact not found", 400);
    const filePath = await new MyVCard().createVCFFromDbObj(contact);
    res.status(200).sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
