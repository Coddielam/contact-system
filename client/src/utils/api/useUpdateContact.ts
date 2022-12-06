import { useState, useEffect } from "react";
import { myAxios } from "./myAxios";
import { TContactReqBody } from "./types/contacts";

const patchContact = async (
  contactId: string,
  contactData: TContactReqBody
) => {
  const res = await myAxios.patch(
    `/api/contacts/${contactId}/update`,
    contactData
  );
  return res;
};

export function usePatchUpdateContact(contactId: string) {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (contactData: TContactReqBody) => {
    setLoading(true);
    try {
      const { data } = await patchContact(contactId, contactData);
      setData(data);
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
