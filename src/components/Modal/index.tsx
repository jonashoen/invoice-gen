import { useEffect, useState } from "react";
import Paper from "../Paper";
import useModalStore from "@/store/modalStore";
import Button from "../Button";

const Modal = () => {
  const [title, open, hide, content] = useModalStore((state) => [
    state.title,
    state.open,
    state.hide,
    state.content,
  ]);

  const [show, setShow] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
      setTimeout(() => {
        setShowBg(true);
        setShowContent(true);
      }, 20);
    } else {
      setShowBg(false);
      setShowContent(false);
      setTimeout(() => {
        setShow(false);
      }, 150);
    }
  }, [open]);

  return (
    <div
      className={[
        "fixed flex justify-center left-0 top-0 right-0 bottom-0 z-50",
        !show && "hidden",
      ].join(" ")}
    >
      <div
        className={[
          "w-full h-full bg-black transition-opacity",
          showBg ? "opacity-30" : "opacity-0",
        ].join(" ")}
        onClick={hide}
      />
      <Paper
        className={[
          "lg:container transition-transform flex-grow fixed -bottom-3 min-h-[75%] max-h-[90%] overflow-y-auto",
          showContent ? "translate-y-0" : "translate-y-full",
        ].join(" ")}
      >
        <div className="p-5 flex flex-grow flex-col">
          <div className="flex justify-between items-center">
            <h4 className="text-3xl">{title}</h4>
            <Button
              className="p-3 cursor-pointer !w-[48px] h-[48px]"
              onClick={hide}
            >
              x
            </Button>
          </div>

          {content}
        </div>
      </Paper>
    </div>
  );
};

export default Modal;
