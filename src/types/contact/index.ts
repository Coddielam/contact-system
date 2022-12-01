export type TContact = {
  id: string;
  firstName: string;
  lastName: string;
  phones: number[];
  addresses: string[];
  emails: string[];
  orgName: string;
  websiteUrl: string;
  notes: string;
  tags: string[];
} & {
  // arbitrary field
  [key: string]: string | number | string[] | number[];
};
