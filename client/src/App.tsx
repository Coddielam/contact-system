import Upload from "./features/Upload/Upoad";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import {
  SelectTag,
  ContactCards,
  CreateContact,
  CreateTag,
  SearchContacts,
} from "./features";
import { useGetContacts } from "./utils/api/useGetContactCards";
import { useGetTag } from "./utils/api/useGetTags";
import { useMemo, useState } from "react";
import { TContact } from "./types/contact";
import { AiOutlineLoading } from "react-icons/ai";
import { TbRobotOff } from "react-icons/tb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { data: tagsData, loading: tagsLoading, err: tagsErr } = useGetTag();
  const { data: contacts, loading, err } = useGetContacts();
  const [selectedTagName, setSelectedTagName] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const searchableContacts = useMemo(() => {
    if (!contacts) return [];
    return contacts.map((contact) => {
      return {
        _id: contact._id,
        searchStr: `${contact.firstName} ${
          contact.lastName
        } ${contact.phones.join(" ")} ${contact.emails.join(" ")} ${contact.tags
          .map((tag) => tag.name)
          .join(" ")} ${contact.websiteUrl}${contact.notes}`.toLowerCase(),
      };
    });
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    // filter based on tags
    let returnContacts: TContact[] = contacts;
    if (selectedTagName) {
      returnContacts = returnContacts.filter((contact) => {
        return contact.tags.find((tag) => tag.name === selectedTagName);
      });
    }
    if (searchValue) {
      const matchSearchContactIds = searchableContacts.reduce<string[]>(
        (ids, contact) =>
          contact.searchStr.includes(searchValue) ? [...ids, contact._id] : ids,
        []
      );

      returnContacts = returnContacts.filter((contact) =>
        matchSearchContactIds.includes(contact._id)
      );
    }
    return returnContacts;
  }, [contacts, selectedTagName, searchableContacts, searchValue]);

  return (
    <>
      <ToastContainer />
      <div className="bg-appbackground w-screen h-screen overflow-scroll">
        <div className="max-w-screen-lg mx-auto py-4">
          {err && (
            <div className="flex flex-col items-center">
              <TbRobotOff className="w-48 h-48 block" />
              <p className="text-4xl font-light">Something went wrong!</p>
            </div>
          )}
          {(loading || !contacts) && (
            <AiOutlineLoading className="h-28 w-28 animate-spin fill-slate-500" />
          )}
          {contacts && tagsData && (
            <DashboardLayout
              topLeftCorner={
                <SelectTag
                  tags={tagsData.tags}
                  selectedTagName={selectedTagName}
                  setSelectedTagName={setSelectedTagName}
                />
              }
              topLeftSecond={
                <SearchContacts
                  value={searchValue}
                  setSearchValue={setSearchValue}
                />
              }
              topCenter={<CreateContact existingTags={tagsData.tags || []} />}
              topRightSecond={<CreateTag />}
              topRightCorner={<Upload />}
              mainArea={
                <ContactCards
                  contacts={filteredContacts}
                  existingTags={tagsData.tags}
                />
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
