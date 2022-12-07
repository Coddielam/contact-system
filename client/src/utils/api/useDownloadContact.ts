import { useState } from "react";
import { myAxios } from "./myAxios";

const getDownloadContact = async (contactId: string) => {
  const res = await myAxios.get(`/api/contacts/download/${contactId}`, {
    responseType: "blob",
  });
  return res;
};

export function useDownloadContact() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (contactId: string) => {
    setLoading(true);
    try {
      const res = await getDownloadContact(contactId);
      return res.data;
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
