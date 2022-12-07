import { RequestHandler } from "express";
import { Document } from "mongoose";
import { CustomError } from "../error";
import { MyVCard } from "../lib/MyVCard";
import { ContactModel, TagModel } from "../models";
import { TContactReqBody } from "../types/contact";
import _ from "lodash";
import fs from "fs";

export const findContact: RequestHandler<
  { id: string },
  { contact: Document },
  {}
> = async (req, res, next) => {
  try {
    const contact = await ContactModel.findById(req.params.id).populate("tags");
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
    const contacts = await ContactModel.find().populate("tags");
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

    const savingContacts = [];
    const updatedContacts = [];
    const skippedContacts = [];

    for (let i = 0; i < req.files!.length; i++) {
      const fileInfo = (req.files as Express.Multer.File[])[i];
      const content = fs.readFileSync(fileInfo.path).toString();
      const contactObjs = new MyVCard().parseToObject(content);

      const stripeNumber = (string: string) => {
        return Number(string.replace(/\D/g, ""));
      };

      for (let i = 0; i < contactObjs.length; i++) {
        const systemTags = await TagModel.find({
          _id: { $in: contactObjs[i].tagIds },
        });

        const uploadedContact = {
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
          tags: systemTags,
          customs: contactObjs[i].customs,
        };
        // check if there's one with the same name
        const contactInDb = await ContactModel.findOne({
          firstName: uploadedContact.firstName,
          lastName: uploadedContact.lastName,
        });

        // check if exact same;
        const isExactSame = !contactInDb
          ? false
          : JSON.stringify({
              firstName: uploadedContact.firstName,
              lastName: uploadedContact.lastName,
              phones: _.sortBy(uploadedContact.phones),
              addresses: _.sortBy(uploadedContact.addresses, ["line1"]),
              emails: _.sortBy(uploadedContact.emails),
            }) ===
            JSON.stringify({
              firstName: contactInDb.firstName,
              lastName: contactInDb.lastName,
              phones: _.sortBy(contactInDb.phones),
              addresses: _.sortBy(
                contactInDb.addresses.map(
                  ({ line1, line2, line3, city, state, postal, country }) => ({
                    line1,
                    line2,
                    line3,
                    city,
                    state,
                    postal,
                    country,
                  })
                ),
                ["line1"]
              ),
              emails: _.sortBy(contactInDb.emails),
            });

        // check if the one in db shares a same number with the one being uploaded
        let isUpdateSamePerson: boolean = false;
        if (contactInDb) {
          isUpdateSamePerson = contactInDb?.phones.find((p) =>
            uploadedContact.phones.includes(p)
          )
            ? true
            : false;
        }

        if (contactInDb && isUpdateSamePerson && !isExactSame) {
          console.log("uodate:", contactInDb.firstName);
          const updatedContact = await ContactModel.findByIdAndUpdate(
            contactInDb._id,
            uploadedContact
          );
          updatedContacts.push(updatedContact);
          continue;
        }

        if (contactInDb && isExactSame) {
          skippedContacts.push(contactInDb);
          continue;
        }

        if (!contactInDb || (contactInDb && !isUpdateSamePerson)) {
          const newContact = new ContactModel(uploadedContact);
          savingContacts.push(newContact);
        }
      }
    }

    const savedContacts = await ContactModel.bulkSave(savingContacts);

    res.status(200).json({
      savedContacts: savingContacts,
      updatedContacts,
      skippedContacts,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadContact: RequestHandler<{ id: string }, {}, {}> = async (
  req,
  res,
  next
) => {
  try {
    const contact = await ContactModel.findById(req.params.id);
    if (!contact) throw new CustomError("Contact not found", 400);
    const filePath = await new MyVCard().createVCFFromDbObj(contact);
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};
