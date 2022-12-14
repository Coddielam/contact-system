import type { TContact } from "../../types/contact";
import { useModal, useRefresh } from "../../hooks";
import { ContactForm, ContactCard } from "../../components";
import { useMemo, useState } from "react";
import { TTag } from "../../utils/api/types/tags";

export default function ContactCards({
  contacts,
  existingTags,
}: {
  contacts: TContact[];
  existingTags: TTag[];
}) {
  const { showModal, setShowModal, Modal } = useModal();
  const [contact, setContact] = useState<TContact>();
  const renderContactCards = useMemo(() => {
    return contacts.map((contact) => (
      <ContactCard
        key={contact._id}
        contact={contact}
        onClick={() => {
          setContact(contact);
          setShowModal(true);
        }}
      />
    ));
  }, [contacts]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* creating tag columns */}
      {renderContactCards}
      {contact && (
        <Modal
          showModal={showModal}
          onCloseBtnClick={() => setShowModal(false)}
        >
          <ContactForm
            contact={contact}
            existingTags={existingTags}
            onSubmitSuccess={() => {
              setShowModal(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
