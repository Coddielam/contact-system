import { FormEventHandler, useState } from "react";
import { useModal } from "../../hooks";
import { usePostContactUpload } from "../../utils/api/useUploadContacts";

export default function Upload() {
  const { data, loading, err, refetch } = usePostContactUpload();
  const { showModal, setShowModal, Modal } = useModal();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    refetch(formData);
  };

  return (
    <>
      <button
        className="px-3 py-2 bg-blue-400 shadow-md rounded-md"
        onClick={() => setShowModal(true)}
      >
        Upload file
      </button>
      <Modal showModal={showModal} onCloseBtnClick={() => setShowModal(false)}>
        <form onSubmit={onSubmit} className="flex gap-3">
          <input
            name="contacts"
            type="file"
            accept=".vcf"
            multiple
            className="bg-slate-700 px-4 p-2 text-white rounded-md shadow-md"
          ></input>
          <input
            type="submit"
            value="Submit Files"
            className="bg-blue-400 py-2 px-3 shadow-md rounded-md items-center justify-center"
          />
        </form>
      </Modal>
    </>
  );
}
