import Upload from "./features/Upload/Upoad";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import { ContactCards, CreateContact, CreateTag } from "./features";
import { TContact } from "./types/contact";

let id = 1;
const dummyExistingTags = ["home", "school", "work"];
const dummyContacts: TContact[] = [
  {
    id: (id++).toString(),
    firstName: "eddie",
    lastName: "lAm",
    phones: [12341234],
    addresses: [
      {
        line1: "",
        line2: "",
        line3: "",
        city: "",
        state: "",
        postal: "",
        country: "",
      },
    ],
    emails: ["123@email.com"],
    orgName: "Topo",
    websiteUrl: "eddie.com",
    notes: "Met at work",
    tags: ["hello"],
  },
];

const SelectTag = () => {
  return (
    <select className="px-2 py-1">
      <option value="">Select a tag</option>
    </select>
  );
};

function App() {
  // useGetContacts
  return (
    <div className="bg-appbackground w-screen h-screen">
      <div className="max-w-screen-lg mx-auto py-4">
        <DashboardLayout
          topLeftCorner={<SelectTag />}
          topLeftSecond={<CreateContact />}
          topRightSecond={<CreateTag />}
          topRightCorner={<Upload />}
          mainArea={
            <ContactCards
              contacts={dummyContacts}
              existingTags={dummyExistingTags}
            />
          }
        />
      </div>
    </div>
  );
}

export default App;
