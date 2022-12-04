export type TPhones = number[];
export type TEmails = string[];

export type TContactReqBody = {
  firstName: string;
  lastName: string;
  phones: TPhones;
  emails: TEmails;
  websiteUrl: string;
  orgName?: string;
  addresses?: string[];
  tags?: string[];
  notes?: string;
} & {
  // arbitrary field
  [key: string]: any;
};
