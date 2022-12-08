import useModal from "../../hooks/useModal";
import { ContactForm } from "../../components";
import { TTag } from "../../utils/api/types/tags";
import { useRefresh } from "../../hooks";

export default function CreateContact({
  existingTags,
}: {
  existingTags: TTag[];
}) {
  const { showModal, setShowModal, Modal } = useModal();
  const { toaster } = useRefresh();

  return (
    <>
      <button
        className="bg-blue-400 bg-opacity-90 px-3 py-2 shadow-md rounded-md"
        onClick={() => setShowModal(true)}
      >
        Create Contact
      </button>
      <Modal
        showModal={showModal}
        onCloseBtnClick={() => {
          setShowModal(false);
        }}
      >
        <ContactForm
          existingTags={existingTags}
          onSubmitSuccess={() => {
            return null;
          }}
        />
      </Modal>
    </>
  );
}
