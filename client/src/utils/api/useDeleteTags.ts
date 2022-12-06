import { useState } from "react";
import { myAxios } from "./myAxios";

export type TDeleteTagsReqBody = {
  tagIds: string[];
};

const putTags = async (tagsData: TDeleteTagsReqBody) => {
  const res = await myAxios.put(`/api/tags/delete`, tagsData);
  return res;
};

export function usePutDeleteTags() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (tagsData: TDeleteTagsReqBody) => {
    setLoading(true);
    try {
      const { data } = await putTags(tagsData);
      setData(data);
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
