import { create } from "zustand";
import { ReactNode } from "react";

interface ModalStore {
  open: boolean;
  show: ({ title, content }: { title: string; content: ReactNode }) => void;
  hide: () => void;
  title?: string;
  content?: ReactNode;
}

const defaultStore = {
  open: false,
  title: undefined,
  content: undefined,
};

const useModalStore = create<ModalStore>((set) => ({
  show: ({ title, content }) =>
    set({
      open: true,
      title,
      content,
    }),
  hide: () => set(defaultStore),
  ...defaultStore,
}));

export default useModalStore;
