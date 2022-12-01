import React, { useState } from "react";
import { Modal } from "../components";

export default function useModal() {
  const [showModal, setShowModal] = useState(false);

  const WithStateModal = (props: React.ComponentProps<typeof Modal>) => {
    return <Modal {...props} />;
  };

  return { showModal, setShowModal, Modal: WithStateModal };
}
