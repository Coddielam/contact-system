import Upload from "./features/Upload/Upoad";
import DashboardLayout from "./layouts/Dashboard/DashboardLayout";
import {
  ContactCards,
  CreateContact,
  CreateTag,
  SearchContacts,
} from "./features";
import { useGetContacts } from "./utils/api/useGetContactCards";
import { useGetTag } from "./utils/api/useGetTags";
import { TTag } from "./utils/api/useUpdateTags";

const SelectTag = ({ tags }: { tags: TTag[] }) => {
  return (
    <select className="px-2 py-1 min-w-[130px]">
      <option value="">- Select Tag -</option>
      {tags.map((tag: { _id: string; name: string }) => {
        return (
          <option key={tag._id} value={tag.name}>
            {tag.name}
          </option>
        );
      })}
    </select>
  );
};

function App() {
  const { data: tagsData, loading: tagsLoading, err: tagsErr } = useGetTag();
  const { data, loading, err } = useGetContacts();

  if (loading || !data) return <p>Loading ...</p>;

  if (err) return <p>Error!</p>;

  return (
    <div className="bg-appbackground w-screen h-screen">
      <div className="max-w-screen-lg mx-auto py-4">
        <DashboardLayout
          topLeftCorner={<SearchContacts />}
          topLeftSecond={
            tagsLoading ? (
              <>Loading ...</>
            ) : tagsErr ? (
              <>x_x</>
            ) : (
              <SelectTag tags={tagsData!.tags} />
            )
          }
          topCenter={<CreateContact />}
          topRightSecond={<CreateTag />}
          topRightCorner={<Upload />}
          mainArea={
            tagsData ? (
              <ContactCards
                contacts={data.contacts}
                existingTags={tagsData.tags}
              />
            ) : (
              <></>
            )
          }
        />
      </div>
    </div>
  );
}

export default App;
