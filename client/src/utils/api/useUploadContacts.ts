import { useState } from "react";
import { myAxios } from "./myAxios";
import { TContactReqBody } from "./types/contacts";

const postContactUpload = async (contactData: FormData) => {
  const res = await myAxios.post("/api/contacts/upload", contactData);
  return res;
};

export function usePostContactUpload() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (contactData: FormData) => {
    setLoading(true);
    try {
      const { data } = await postContactUpload(contactData);
      setData(data);
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
