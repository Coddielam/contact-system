import type { TContact } from "../../types/contact";
import { useModal } from "../../hooks";
import { ContactForm, ContactCard } from "../../components";

const dummyContact = {
  id: "1",
  firstName: "eddie",
  lastName: "lAm",
  phones: [12341234, 12341234],
  addresses: [
    {
      line1: "",
      line2: "",
      line3: "",
      city: "",
      state: "",
      postal: "",
      country: "",
    },
  ],
  emails: ["123@email.com", "123@email.com"],
  orgName: "Topo",
  websiteUrl: "eddie.com",
  notes: "Met at work",
  tags: ["home"],
};

export default function ContactCards({
  contacts,
  existingTags,
}: {
  contacts: TContact[];
  existingTags: string[];
}) {
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
      <Modal showModal={showModal} onCloseBtnClick={() => setShowModal(false)}>
        <ContactForm
          contact={dummyContact}
          existingTags={existingTags}
          onSubmitSuccess={() => {
            window.location.reload();
          }}
        />
      </Modal>
    </div>
  );
}
