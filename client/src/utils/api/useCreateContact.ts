import { useState, useEffect } from "react";
import { myAxios } from "./myAxios";
import { TContactReqBody } from "./types/contacts";

const postContact = async (contactData: TContactReqBody) => {
  const res = await myAxios.post("/api/contacts/create", contactData);
  return res;
};

export function usePostContact() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (contactData: TContactReqBody) => {
    setLoading(true);
    try {
      const { data } = await postContact(contactData);
      setData(data);
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
