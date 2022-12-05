import fs from "fs";
import path from "path/posix";
import VCard from "vcf";
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
  [key: string]: any;
};

export class MyVCard extends VCard {
  constructor() {
    super();
  }

  public parseToObject(string: string): TRenamedVCard[] {
    const rawVCardsArr = VCard.parse(string);
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

        if (["email", "adr", "tel"].includes(key)) {
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
      };

      renamedObj.emails = vcardData.email;
      renamedObj.phones = vcardData.tel;
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
      const notIncludedKeys = Object.keys(vcardData).filter(
        (key) => !Object.keys(renamedObj).includes(key)
      );
      notIncludedKeys.forEach((key) => {
        // only accept strings
        if (typeof vcardData[key] === "string") {
          renamedObj[key] = vcardData[key];
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
      // tags,
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

    // tags.forEach((tag) => {
    //   main += `X-TAG:${tag}\n`;
    // });

    const fileContent = `BEGIN:VCARD
    VERSION:4.0
    ${main}
    END:VCARD`;

    const fileName = `${firstName}-${lastName}-${phones[0]}.vcf`;
    const filePath = path.join(__dirname, `../public/vCards/${fileName}`);
    try {
      await fs.promises.appendFile(
        path.join(__dirname, `../public/vCards/${fileName}`),
        fileContent
      );
      return filePath;
    } catch (error) {
      throw error;
    }
  }
}
