import { TTag } from "./tags";

export type TPhones = number[];
export type TEmails = string[];

export type TContactReqBody = {
  firstName: string;
  lastName: string;
  phones: number[];
  addresses: {
    line1: string;
    line2: string;
    line3: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  }[];
  emails: string[];
  orgName: string;
  websiteUrl: string;
  notes: string;
  tags: TTag[];
} & {
  // custom fields
  customs: { _id?: string; label: string; value: string }[];
};
