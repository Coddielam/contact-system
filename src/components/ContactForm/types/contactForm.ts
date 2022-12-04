import { TContact, TEmails, TPhones } from "../../../types/contact";

export type TContactForm = TContact & {
  additionalPhones: TPhones;
  additionalEmails: TEmails;
};
