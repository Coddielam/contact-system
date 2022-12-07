import { useState } from "react";
import { myAxios } from "./myAxios";

const deleteContact = async (contactId: string) => {
  const res = await myAxios.delete(`/api/contacts/${contactId}/delete`);
  return res;
};

export function useDeleteContact() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (contactId: string) => {
    setLoading(true);
    try {
      const res = await deleteContact(contactId);
      return res.data;
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
