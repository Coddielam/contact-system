export default function SearchContacts({
  value,
  setSearchValue,
}: {
  value: string;
  setSearchValue: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name=""
      value={value}
      onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
      placeholder="Search Contact"
      className="rounded-md shadow-md"
    />
  );
}
