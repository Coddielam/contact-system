import ContactCard from "../../components/ContactCard/ContactCard";
import type { TContact } from "../../types/contact";
import { useModal } from "../../hooks";

export default function ContactCards({ contacts }: { contacts: TContact[] }) {
  const { showModal, setShowModal, Modal } = useModal();

  return (
    <div className="flex flex-wrap gap-3">
      {/* creating tag columns */}
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onClick={() => setShowModal(true)}
        />
      ))}
      <Modal
        showModal={showModal}
        onCloseBtnClick={() => setShowModal(false)}
      />
    </div>
  );
}
