import { create } from "zustand";
import { ReactNode } from "react";

interface ModalStore {
  open: boolean;
  show: (args: {
    title: string;
    content: ReactNode;
    cancelable?: boolean;
  }) => void;
  hide: () => void;
  title?: string;
  content?: ReactNode;
  cancelable?: boolean;
}

const defaultStore = {
  open: false,
  title: undefined,
  content: undefined,
  cancelable: true,
};

const useModalStore = create<ModalStore>((set) => ({
  show: ({ title, content, cancelable }) =>
    set({
      open: true,
      title,
      content,
      cancelable: cancelable ?? true,
    }),
  hide: () => set(defaultStore),
  ...defaultStore,
}));

export default useModalStore;
