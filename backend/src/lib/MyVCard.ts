import fs from "fs";
import path from "path";
import VCard from "vcf";
import { CustomError } from "../error";
import { TContact } from "../models/contact.model";

type TVCardData = {
  email: string[];
  tel: string[];
  adr: string[][];
  version: string;
  n: string[];
  fn: string;
  [key: string]: any;
};

type TRenamedVCard = {
  emails: string[];
  phones: string[];
  adresses: {
    line1: string;
    line2: string;
    line3: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  }[];
  name: {
    surname: string;
    name: string;
    additionalName?: string;
    prefix?: string;
    suffix?: string;
  };
  fullName: string;
  org: string;
  url: string;
  note: string;
  tagIds: string[];
  customs: { label: string; value: string }[];
};

export class MyVCard extends VCard {
  constructor() {
    super();
  }

  // contact.vcf should have X-TAGID to upload contact that contain tags that exist in the system
  static X_TAG_ID = "x-tagid";
  static VCF_XTAG_ID = MyVCard.X_TAG_ID.toUpperCase();

  public parseToObject(string: string): TRenamedVCard[] {
    let rawVCardsArr: VCard[] = [];
    try {
      rawVCardsArr = VCard.parse(string);
    } catch (error) {
      console.error(error);
    }
    // retry with version error fix
    if (!rawVCardsArr.length) {
      try {
        rawVCardsArr = VCard.parse(string.replace(/\r?\n/g, "\r\n"));
      } catch (error) {
        throw new CustomError("Failed to parse vcf.");
      }
    }

    if (!rawVCardsArr.length) throw new CustomError("Failed to parse vcf.");

    const objects = rawVCardsArr.map((vcard) => {
      const fieldsArray = vcard.toJSON()[1];
      const defaultVCardData = {
        n: [],
        fn: "",
        version: "",
        email: [],
        tel: [],
        adr: [],
      };
      const vcardData = fieldsArray.reduce<TVCardData>((obj, arr) => {
        const key = arr[0];
        let value = arr[arr.length - 1];

        if (["email", "adr", "tel", MyVCard.X_TAG_ID].includes(key)) {
          return { ...obj, [key]: [...obj[key], value] };
        }

        return Object.assign(obj, { [key]: arr[arr.length - 1] });
      }, defaultVCardData);

      // renaming vcard data key for ease of use
      let renamedObj: TRenamedVCard = {
        emails: [],
        phones: [],
        adresses: [],
        name: {
          surname: "",
          name: "",
          additionalName: "",
          prefix: "",
          suffix: "",
        },
        fullName: "",
        org: "",
        url: "",
        note: "",
        tagIds: [],
        customs: [],
      };

      renamedObj.emails = vcardData.email;
      renamedObj.phones = vcardData.tel;
      renamedObj.org = vcardData.org;
      renamedObj.url = vcardData.url;
      renamedObj.note = vcardData.note;

      renamedObj.adresses = vcardData.adr.map((address) => {
        return {
          line1: address[0] || "",
          line2: address[1] || "",
          line3: address[2] || "",
          city: address[3] || "",
          state: address[4] || "",
          postal: address[5] || "",
          country: address[6] || "",
        };
      });
      renamedObj.name = vcardData.n.reduce(
        (nameObj, str, index) => {
          return { ...nameObj, [Object.keys(nameObj)[index]]: str };
        },
        {
          surname: "",
          name: "",
          additionalName: "",
          prefix: "",
          suffix: "",
        }
      );
      renamedObj.fullName = vcardData.fn;
      renamedObj.tagIds = vcardData[MyVCard.X_TAG_ID];

      // custom fields
      const notIncludedKeys = Object.keys(vcardData).filter(
        (key) => !Object.keys(renamedObj).includes(key)
      );
      notIncludedKeys.forEach((key) => {
        // only accept strings
        if (typeof vcardData[key] === "string") {
          renamedObj.customs.push({ label: key, value: vcardData[key] });
        }
      });

      return renamedObj;
    });
    return objects;
  }

  public async createVCFFromDbObj(obj: TContact) {
    let main = "";
    const {
      firstName,
      lastName,
      phones,
      addresses,
      emails,
      orgName,
      websiteUrl,
      notes,
      tags,
      customs,
    } = obj;
    // name
    main += `N:${firstName};${lastName};;;\n`;
    // full name
    main += `FN:${firstName} ${lastName}}\n`;
    // add emails
    emails.forEach((email) => {
      main += `EMAIL:${email}\n`;
    });
    // add phones
    phones.forEach((phone) => {
      main += `TEL:${phone}\n`;
    });
    // addresses
    addresses.forEach((address) => {
      main += `ADR:${address.line1};${address.line2};${address.line3};${address.city};${address.state};${address.postal};${address.country}\n`;
    });
    // org
    main += `ORG:${orgName}\n`;
    // website url
    main += `URL:${websiteUrl}\n`;
    // note
    main += `NOTE:${notes}\n`;
    // tags.
    tags.forEach((tag) => {
      main += `${MyVCard.VCF_XTAG_ID}:${tag._id}\n`;
    });
    // custom fields
    customs.forEach((customF) => {
      main += `${customF.label.toUpperCase()}:${customF.value}\n`;
    });

    const fileContent = `BEGIN:VCARD\nVERSION:4.0\n${main}END:VCARD`;

    const fileName = `${firstName}-${lastName}-${phones[0]}.vcf`;
    const writePath = `public/download/vcards/${fileName}`;
    try {
      await fs.promises.writeFile(path.join(writePath), fileContent);
      return writePath;
    } catch (error) {
      throw error;
    }
  }
}
