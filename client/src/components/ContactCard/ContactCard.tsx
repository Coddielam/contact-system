import React from "react";
import type { TContact } from "../../types/contact";
import { getFullName } from "../../utils/formatContact";
import SingleOrMultipleField from "./components/SingleOrMultipleField/SingleOrMultipleField";
import { useGetContacts } from "../../utils/api/useGetContactCards";

export default function ContactCard({
  contact: {
    id,
    firstName,
    lastName,
    orgName,
    addresses,
    emails,
    phones,
    websiteUrl,
    notes,
    tags,
  },
  onClick,
}: {
  contact: TContact;
  onClick: () => void;
}) {
  const { data, loading, err, refetch } = useGetContacts();
  console.log("contacts:", data);

  return (
    <div
      className="p-4 bg-slate-50 rounded-md px-12 py-6 flex flex-col shadow-md cursor-pointer hover:scale-105 transition-transform"
      onClick={onClick}
    >
      <p className="text-4xl font-thin mb-2">
        {getFullName(firstName, lastName)}
      </p>
      <p className="font-bold mb-6">{orgName}</p>
      <div className="text-sm grid gap-2">
        <SingleOrMultipleField
          data={addresses.map((address) => Object.values(address).join())}
        />
        <SingleOrMultipleField data={emails} />
        <SingleOrMultipleField data={phones} prefix="T:" />
      </div>
      <div className="mt-4">
        {tags.map((tag) => {
          return (
            <span
              key={id + tag}
              className="bg-slate-300 px-2 py-1 text-xs rounded-sm"
            >
              {tag}
            </span>
          );
        })}
      </div>
    </div>
  );
}
