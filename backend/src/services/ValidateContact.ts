import { TContact } from "../models/contact.model";
import { TContactReqBody } from "../types/contact";

export class ValidateContact {
  static emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  static phoneRegex = /^\d{8}$/;

  private isValid: boolean = false;
  private contact: TContactReqBody;
  private errResult: {
    name: boolean;
    phone: boolean;
    email: boolean;
    website: boolean;
  };

  constructor(contact: TContactReqBody) {
    this.contact = contact;
    this.errResult = {
      name: false,
      phone: false,
      email: false,
      website: false,
    };
  }

  // same as client side validation logic
  private checkWebsite(): boolean {
    if (typeof this.contact.websiteUrl !== "string") return false;
    let url: URL;
    try {
      url = new URL(this.contact.websiteUrl);
    } catch (error) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  checkNameValid() {
    const result =
      this.contact.firstName && this.contact.lastName ? true : false;
    this.errResult.name = !result;
    this.isValid = result;
    return this;
  }
  checkPhoneValid() {
    const result = this.contact.phones.every((p) =>
      ValidateContact.phoneRegex.test(p.toString())
    );
    this.errResult.phone = !result;
    this.isValid = result;
    return this;
  }
  checkEmailValid() {
    const result = this.contact.emails.every((e) =>
      ValidateContact.emailRegex.test(e)
    );
    this.errResult.email = !result;
    this.isValid = result;
    return this;
  }
  checkWebsiteValid() {
    if (this.contact.websiteUrl.length) {
      const result = this.checkWebsite();
      this.errResult.website = !result;
      this.isValid = result;
      return this;
    }
    return this;
  }

  get isValidContact(): boolean {
    return this.isValid;
  }
}
