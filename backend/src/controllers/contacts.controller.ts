import { RequestHandler } from "express";
import { Document } from "mongoose";
import { CustomError } from "../error";
import { MyVCard } from "../lib/MyVCard";
import { ContactModel, TagModel } from "../models";
import { TContactReqBody } from "../types/contact";
import _ from "lodash";
import fs from "fs";
import { TContact } from "../models/contact.model";
import { stringify } from "querystring";

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
      // helper function
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
        const contactsInDb = await ContactModel.find({
          firstName: uploadedContact.firstName,
          lastName: uploadedContact.lastName,
        });

        // helper function
        const stringifyDbContact = (
          doc: Document<any, any, TContact> & TContact
        ) => {
          return JSON.stringify({
            firstName: doc.firstName,
            lastName: doc.lastName,
            phones: _.sortBy(doc.phones),
            addresses: _.sortBy(
              doc.addresses.map(
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
            emails: _.sortBy(doc.emails),
          });
        };

        const stringifiedDbContacts = contactsInDb.map((contact) =>
          stringifyDbContact(contact)
        );

        // check if exact same;
        const hasExactSame = !contactsInDb.length
          ? undefined
          : stringifiedDbContacts.find(
              (contact) =>
                contact ===
                JSON.stringify({
                  firstName: uploadedContact.firstName,
                  lastName: uploadedContact.lastName,
                  phones: _.sortBy(uploadedContact.phones),
                  addresses: _.sortBy(uploadedContact.addresses, ["line1"]),
                  emails: _.sortBy(uploadedContact.emails),
                })
            )
          ? true
          : false;

        const contactInDb = hasExactSame;

        // check if the one in db shares a same number with the one being uploaded
        let updateSamePerson:
          | (Document<any, any, TContact> & TContact)
          | undefined;
        if (contactsInDb.length) {
          updateSamePerson = contactsInDb.find((contact) =>
            contact.phones.find((phone) =>
              uploadedContact.phones.includes(phone)
            )
          );
        }

        if (updateSamePerson && !hasExactSame) {
          const updatedContact = await ContactModel.findByIdAndUpdate(
            updateSamePerson._id,
            uploadedContact
          );
          updatedContacts.push(updatedContact);
          continue;
        }

        if (hasExactSame) {
          skippedContacts.push(contactInDb);
          continue;
        }

        if (!hasExactSame || !updateSamePerson) {
          const newContact = new ContactModel(uploadedContact);
          savingContacts.push(newContact);
        }
      }
    }

    await ContactModel.bulkSave(savingContacts);

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
