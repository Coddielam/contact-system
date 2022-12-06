import { useState, useEffect } from "react";
import { myAxios } from "./myAxios";

type TCreateTagReqBody = { tag: string };

const postTag = async (contactData: TCreateTagReqBody) => {
  const res = await myAxios.post("/api/tags/create", contactData);
  return res;
};

export function useCreateTag() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (contactData: TCreateTagReqBody) => {
    setLoading(true);
    try {
      const { data } = await postTag(contactData);
      setData(data);
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
