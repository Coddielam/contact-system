import { TContact, TEmails, TPhones, TAddresses } from "../../../types/contact";

export type TContactForm = TContact & {
  additionalPhones: TPhones;
  additionalEmails: TEmails;
  additionalAddresses: TAddresses;
};
