import Upload from "./features/Upload/Upoad";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import { ContactCards, CreateTag } from "./features";
import { TContact } from "./types/contact";

let id = 1;
const dummyContacts: TContact[] = [
  {
    id: (id++).toString(),
    firstName: "eddie",
    lastName: "lAm",
    phones: [12341234],
    addresses: ["123 Eddie St."],
    emails: ["123@email.com"],
    orgName: "Topo",
    websiteUrl: "eddie.com",
    notes: "Met at work",
    tags: ["hello"],
  },
  {
    id: (id++).toString(),
    firstName: "eddie",
    lastName: "lAm",
    phones: [12341234],
    addresses: ["123 Eddie St."],
    emails: ["123@email.com"],
    orgName: "Topo",
    websiteUrl: "eddie.com",
    notes: "Met at work",
    tags: ["hello"],
  },
  {
    id: (id++).toString(),
    firstName: "eddie",
    lastName: "lAm",
    phones: [12341234],
    addresses: ["123 Eddie St."],
    emails: ["123@email.com"],
    orgName: "Topo",
    websiteUrl: "eddie.com",
    notes: "Met at work",
    tags: ["hello"],
  },
  {
    id: (id++).toString(),
    firstName: "eddie",
    lastName: "lAm",
    phones: [12341234],
    addresses: ["123 Eddie St."],
    emails: ["123@email.com"],
    orgName: "Topo",
    websiteUrl: "eddie.com",
    notes: "Met at work",
    tags: ["hello"],
  },
  {
    id: (id++).toString(),
    firstName: "eddie",
    lastName: "lAm",
    phones: [12341234],
    addresses: ["123 Eddie St."],
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
  return (
    <div className="bg-appbackground w-screen h-screen">
      <div className="max-w-screen-lg mx-auto py-4">
        <DashboardLayout
          topLeftCorner={<SelectTag />}
          topRightSecond={<CreateTag />}
          topRightCorner={<Upload />}
          mainArea={<ContactCards contacts={dummyContacts} />}
        />
      </div>
    </div>
  );
}

export default App;
