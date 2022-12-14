import React from "react";
import type { TContact } from "../../types/contact";
import { getFullName } from "../../utils/formatContact";
import SingleOrMultipleField from "./components/SingleOrMultipleField/SingleOrMultipleField";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import cn from "classnames";
import { useDownloadContact } from "../../utils/api/useDownloadContact";
import { useDeleteContact } from "../../utils/api/useDeleteContact";
import { useRefresh } from "../../hooks";

function ContactCard({
  contact: {
    _id,
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
  const [showTooltip, setShowTooltip] = useState(false);
  const { refetch: download, err: downloadErr } = useDownloadContact();
  const { refetch: deleteContact, err: deleteErr } = useDeleteContact();
  const { toaster } = useRefresh();

  const onDownload = async () => {
    const blob = await download(_id);
    const a = document.createElement("a");
    a.classList.add("hidden");
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = firstName + lastName + ".vcf";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

    if (!downloadErr) {
      setShowTooltip(false);
    }
  };

  const onDelete = async () => {
    await deleteContact(_id);
    if (!deleteErr) {
      setShowTooltip(false);
      toaster.toast("Contact Deleted");
    }
  };

  return (
    <div
      className="p-4 bg-slate-50 rounded-md px-12 py-6 flex flex-col shadow-md cursor-pointer hover:scale-105 transition-transform overflow-hidden relative"
      onClick={onClick}
    >
      <div
        className="absolute right-3 top-4 hover:bg-slate-200 transition-all cursor-pointer p-2 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip((state) => !state);
        }}
      >
        <SlOptionsVertical />
        <ul
          className={cn(
            "absolute right-0 bg-white shadow-lg rounded-md p-2 mt-3",
            { hidden: !showTooltip }
          )}
        >
          <li
            role="button"
            className="whitespace-nowrap px-2 hover:bg-blue-300 transition-all"
            onClick={onDownload}
          >
            Download .vcf
          </li>
          <li
            role="button"
            className="whitespace-nowrap px-2 hover:bg-red-300 transition-all"
            onClick={onDelete}
          >
            Delete
          </li>
        </ul>
      </div>
      <p className="text-4xl font-thin mb-2">
        {getFullName(firstName, lastName)}
      </p>
      <p className="font-bold mb-6">{orgName}</p>
      <div className="text-sm grid gap-2 break-words">
        <SingleOrMultipleField
          data={addresses.map(({ _id, ...actualAddr }) =>
            Object.values(actualAddr).join(" ")
          )}
        />
        <SingleOrMultipleField data={emails} />
        <SingleOrMultipleField data={phones} prefix="T:" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => {
          return (
            <span
              key={tag._id}
              className="bg-slate-300 px-2 py-1 text-xs rounded-sm"
            >
              {tag.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(ContactCard);
