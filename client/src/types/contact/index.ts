import { TTag } from "../../utils/api/types/tags";

export type TPhones = number[];
export type TEmails = string[];
export type TAddress = {
  _id: string;
  line1: string;
  line2: string;
  line3: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};
export type TAddresses = TAddress[];

export type TContact = {
  _id: string;
  firstName: string;
  lastName: string;
  phones: TPhones;
  addresses: TAddresses;
  emails: TEmails;
  orgName: string;
  websiteUrl: string;
  notes: string;
  tags: TTag[];
} & {
  // arbitrary field
  [key: string]: any;
};
