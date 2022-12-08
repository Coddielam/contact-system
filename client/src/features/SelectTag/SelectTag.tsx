import { TTag } from "../../utils/api/useUpdateTags";

const SelectTag = ({
  tags,
  selectedTagName,
  setSelectedTagName,
}: {
  tags: TTag[];
  selectedTagName: string;
  setSelectedTagName: (tagName: string) => void;
}) => {
  return (
    <select
      className="px-2 py-1 min-w-[130px]"
      value={selectedTagName}
      onChange={(e) => setSelectedTagName(e.target.value)}
    >
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

export default SelectTag;
