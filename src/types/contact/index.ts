export type TPhones = number[];
export type TEmails = string[];

export type TContact = {
  id: string;
  firstName: string;
  lastName: string;
  phones: TPhones;
  addresses: string[];
  emails: TEmails;
  orgName: string;
  websiteUrl: string;
  notes: string;
  tags: string[];
} & {
  // arbitrary field
  [key: string]: any;
};
