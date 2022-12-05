import { useState, useEffect } from "react";
import { myAxios } from "./myAxios";

const getContacts = async () => {
  const res = await myAxios.get("/api/contacts/all");
  return res;
};

export function useGetContacts() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getContacts();
      console.log(res);
      setData(res.data);
    } catch (error) {
      setErr(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, err, refetch: fetch };
}
