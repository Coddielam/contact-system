import { PropsWithChildren, useState } from "react";
import ReactDOM from "react-dom";
import { AiFillCloseCircle } from "react-icons/ai";

export default function Modal({
  children,
  showModal,
  onCloseBtnClick,
}: PropsWithChildren<{ showModal: boolean; onCloseBtnClick?: () => void }>) {
  const ModalComponent = () => {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-slate-700 bg-opacity-40 py-16 overflow-scroll">
        <div className="bg-slate-50 p-8 pb-16 rounded-md shadow-md w-1/2 min-w-[600px] mx-auto">
          <div>
            <AiFillCloseCircle
              role="button"
              className="h-6 w-6 fill-red-500 ml-auto"
              onClick={onCloseBtnClick}
            />
          </div>
          {children}
        </div>
      </div>
    );
  };

  return ReactDOM.createPortal(
    showModal ? <ModalComponent /> : null,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.getElementById("modal-portal")!
  );
}
