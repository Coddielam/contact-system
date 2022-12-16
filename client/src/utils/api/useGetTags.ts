import { useState, useEffect } from "react";
import { myAxios } from "./myAxios";
import { TTag } from "./types/tags";

const getTags = async () => {
  const res = await myAxios.get("/api/tags/all");
  return res;
};

export function useGetTag(noAutoFetch = false) {
  const [data, setData] = useState<{ tags: TTag[] }>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getTags();
      setData(res.data);
    } catch (error) {
      setErr(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!noAutoFetch) {
      fetch();
    }
  }, [noAutoFetch]);

  return { data, loading, err, refetch: fetch };
}
