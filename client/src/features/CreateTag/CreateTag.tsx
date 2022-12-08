import { FormEventHandler, useState } from "react";
import { useModal, useRefresh } from "../../hooks";
import { useCreateTag } from "../../utils/api/useCreateTag";
import { useGetTag } from "../../utils/api/useGetTags";
import cn from "classnames";
import {
  TUpdateTagsReqBody,
  usePatchUpdateTags,
} from "../../utils/api/useUpdateTags";
import { usePutDeleteTags } from "../../utils/api/useDeleteTags";

export default function Upload() {
  const { showModal, setShowModal, Modal } = useModal();
  const [action, setAction] = useState<"CREATE" | "UPDATE" | "DELETE">(
    "CREATE"
  );
  const { data: tagsData, loading, err, refetch } = useGetTag();
  const { toaster } = useRefresh();
  // handle create
  const { refetch: postTag, err: createTagErr } = useCreateTag();
  const [isCreateInvalid, setIsCreateInvalid] = useState(false);

  const onCreateTag: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsCreateInvalid(false);
    const formData = new FormData(e.currentTarget);
    if (!formData.get("tag")) {
      setIsCreateInvalid(true);
    }
    try {
      await postTag({ tag: formData.get("tag") as string });
      if (!createTagErr) {
        setShowModal(false);
        toaster.toast("Tag has been created!");
      }
    } catch (error) {
      console.error(err);
    }
  };

  // handle update
  const {
    loading: updateTagsLoading,
    err: updateTagsError,
    refetch: patchTags,
  } = usePatchUpdateTags();
  const onUpdateTags: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reqBody: TUpdateTagsReqBody = { tags: [] };
    for (const [key, value] of formData.entries()) {
      reqBody.tags.push({ _id: key, name: value as string });
    }
    await patchTags(reqBody);
    !updateTagsError && setShowModal(false);
    setShowModal(false);
    toaster.toast("Tag has been updated!");
  };

  // handle delete
  const { refetch: deleteTags, err: deleteTagsErr } = usePutDeleteTags();
  const onDeleteTags: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reqData = { tagIds: (formData.getAll("tagId") as string[]) || [] };

    await deleteTags(reqData);
    if (deleteTagsErr) return;
    setShowModal(false);
    toaster.toast("Tag has been deleted!");
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
      <Modal
        showModal={showModal}
        onCloseBtnClick={() => {
          setShowModal(false);
        }}
      >
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
              {!tagsData.tags.length && (
                <p className="text-slate-300">No Tags</p>
              )}

              {!tagsData.tags.length ? (
                <></>
              ) : (
                <form
                  onSubmit={onUpdateTags}
                  className="flex flex-col gap-3 items-start"
                >
                  {tagsData.tags.map((tag: { _id: string; name: string }) => {
                    return (
                      <input
                        key={tag._id}
                        name={tag._id}
                        type="text"
                        defaultValue={tag.name}
                      />
                    );
                  })}
                  <input
                    type="submit"
                    value="Update"
                    className={cn("py-1 px-3 bg-blue-400 rounded-md")}
                  />
                  {updateTagsError && (
                    <p className="text-error">Server error</p>
                  )}
                </form>
              )}
            </div>
          )}
          {/* DELETE VIEW */}
          {action === "DELETE" && (
            <div className="mt-5 border-t-2 border-slate-300 pt-5">
              {!tagsData.tags.length && (
                <p className="text-slate-300">No Tags</p>
              )}

              {!tagsData.tags.length ? (
                <></>
              ) : (
                <form
                  onSubmit={onDeleteTags}
                  className="flex gap-3 flex-wrap items-center"
                >
                  {tagsData.tags.map((tag: { _id: string; name: string }) => {
                    return (
                      <>
                        <label className="mt-0" htmlFor={tag._id}>
                          {tag.name}
                        </label>
                        <input
                          key={tag._id}
                          id={tag._id}
                          type="checkbox"
                          name="tagId"
                          value={tag._id}
                        />
                      </>
                    );
                  })}
                  <div className="w-full">
                    <input
                      type="submit"
                      value="Delete"
                      className="bg-red-500 text-slate-100 px-4 py-1 rounded-md shadow-md"
                    />
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
