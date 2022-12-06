import { FormEventHandler, useState } from "react";
import { useModal } from "../../hooks";
import { useCreateTag } from "../../utils/api/useCreateTag";
import { useGetTag } from "../../utils/api/useGetTags";
import cn from "classnames";

export default function Upload() {
  const { showModal, setShowModal, Modal } = useModal();
  const [action, setAction] = useState<"CREATE" | "UPDATE" | "DELETE">(
    "CREATE"
  );
  const { data: tagsData, loading, err, refetch } = useGetTag();
  const { refetch: postTag, err: createTagErr } = useCreateTag();
  // handle create
  const [isCreateInvalid, setIsCreateInvalid] = useState(false);
  const onCreateTag: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsCreateInvalid(false);
    const formData = new FormData(e.currentTarget);
    if (!formData.get("tag")) {
      setIsCreateInvalid(true);
    }
    await postTag({ tag: formData.get("tag") as string });
    if (!createTagErr) {
      setShowModal(false);
    }
  };
  const onUpdateTags: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };
  const onDeleteTags: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  if (!tagsData) return <>Loading ...</>;

  return (
    <>
      <button
        className="bg-orange-400 px-4 p-2 text-white rounded-md shadow-md"
        onClick={() => setShowModal(true)}
      >
        Create Tag
      </button>
      <Modal showModal={showModal} onCloseBtnClick={() => setShowModal(false)}>
        <div className="w-full flex flex-col gap-5">
          <h1>Create a new tag:</h1>
          {/* actions panel */}
          <div className="flex gap-4 w-full">
            <button
              className="px-3 py-1 rounded-md shadow-md bg-orange-400"
              onClick={() => setAction("CREATE")}
            >
              Create A New Tag
            </button>
            <button
              className="px-3 py-1 rounded-md shadow-md bg-orange-400"
              onClick={() => setAction("UPDATE")}
            >
              Update Exsiting Tags
            </button>
            <button
              className="px-3 py-1 rounded-md shadow-md bg-orange-400"
              onClick={() => setAction("DELETE")}
            >
              Delete Existing Tags
            </button>
          </div>
          {/* CREATE VIEW */}
          {action === "CREATE" && (
            <div className="mt-5 border-t-2 border-slate-300 pt-5">
              <form className="w-full" onSubmit={onCreateTag}>
                <p className="mb-4">
                  Existing tags:{" "}
                  {tagsData.tags.reduce(
                    (
                      string: string,
                      tag: { _id: string; name: string },
                      index: number
                    ) => string + (index > 0 ? ", " : "") + tag.name,
                    ""
                  )}
                </p>
                <input
                  type="text"
                  placeholder="Tag name"
                  name="tag"
                  className="w-1/2"
                />
                <input
                  type="submit"
                  value="Create"
                  className={cn("ml-4 py-1 px-3 bg-blue-400 rounded-md")}
                />
                {isCreateInvalid && (
                  <p className="text-error">Tag name is required</p>
                )}
              </form>
            </div>
          )}
          {/* UPDATE VIEW */}
          {action === "UPDATE" && (
            <div className="mt-5 border-t-2 border-slate-300 pt-5">
              <form onSubmit={onUpdateTags}>
                {tagsData.tags.map((tag: { _id: string; name: string }) => {
                  return (
                    <input key={tag._id} type="text" defaultValue={tag.name} />
                  );
                })}
              </form>
            </div>
          )}
          {/* DELETE VIEW */}
          {action === "DELETE" && (
            <div className="mt-5 border-t-2 border-slate-300 pt-5">
              <form onSubmit={onDeleteTags}>
                {tagsData.tags.map((tag: { _id: string; name: string }) => {
                  return (
                    <>
                      <label htmlFor={tag._id}>{tag.name}</label>
                      <input
                        key={tag._id}
                        id={tag._id}
                        type="checkbox"
                        value={tag._id}
                      />
                    </>
                  );
                })}
              </form>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
