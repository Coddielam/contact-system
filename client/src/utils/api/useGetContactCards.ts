import { useState, useEffect } from "react";
import { TContact } from "../../types/contact";
import { myAxios } from "./myAxios";

const getContacts = async () => {
  const res = await myAxios.get("/api/contacts/all");
  return res;
};

export function useGetContacts() {
  const [data, setData] = useState<TContact[]>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getContacts();
      setData(res.data.contacts);
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
