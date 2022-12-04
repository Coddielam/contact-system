import { RequestHandler } from "express";
import { Document } from "mongoose";
import { ContactModel } from "../models";
import { TContactReqBody } from "../types/contact";

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
    const contacts = await ContactModel.find();
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
