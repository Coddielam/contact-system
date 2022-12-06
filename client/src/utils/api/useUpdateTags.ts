import { useState } from "react";
import { myAxios } from "./myAxios";

type TTag = {
  _id: string;
  name: string;
};

export type TUpdateTagsReqBody = {
  tags: TTag[];
};

const patchContact = async (tagsData: TUpdateTagsReqBody) => {
  const res = await myAxios.patch(`/api/tags/update`, tagsData);
  return res;
};

export function usePatchUpdateTags() {
  const [data, setData] = useState<any>();
  const [err, setErr] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (tagsData: TUpdateTagsReqBody) => {
    setLoading(true);
    try {
      const { data } = await patchContact(tagsData);
      setData(data);
    } catch (error) {
      setErr(error);
    }
    setLoading(false);
  };

  return { data, loading, err, refetch: fetch };
}
