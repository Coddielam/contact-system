import Upload from "./features/Upload/Upoad";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import { ContactCards, CreateContact, CreateTag } from "./features";
import { useGetContacts } from "./utils/api/useGetContactCards";
const dummyExistingTags = ["home", "school", "work"];

const SelectTag = () => {
  return (
    <select className="px-2 py-1">
      <option value="">Select a tag</option>
    </select>
  );
};

function App() {
  // useGetContacts
  const { data, loading, err } = useGetContacts();

  if (loading || !data) return <p>Loading ...</p>;

  if (err) return <p>Error!</p>;

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
              contacts={data.contacts}
              existingTags={dummyExistingTags}
            />
          }
        />
      </div>
    </div>
  );
}

export default App;
