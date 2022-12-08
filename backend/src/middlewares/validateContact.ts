import { RequestHandler } from "express";
import { CustomError } from "../error";
import { ValidateContact } from "../services/ValidateContact";
import { TContactReqBody } from "../types/contact";

const validateContact: RequestHandler<{}, {}, TContactReqBody> = (
  req,
  res,
  next
) => {
  const contact = new ValidateContact(req.body);
  const isValidContact = contact
    .checkNameValid()
    .checkPhoneValid()
    .checkEmailValid()
    .checkWebsiteValid().isValidContact;

  if (!isValidContact) throw new CustomError("Invalid request body", 400);
  next();
};

export default validateContact;
