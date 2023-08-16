import { create } from "zustand";

interface UserStore {
  isAuthed?: boolean;
  login: () => void;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  isAuthed: undefined,
  login: () => set({ isAuthed: true }),
  logout: () => set({ isAuthed: false }),
}));

export default useUserStore;
