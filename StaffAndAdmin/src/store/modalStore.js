import { create } from "zustand";

export const useModalStore = create((set) => ({
  modal: null,
  open: (name) => set({ modal: name }),
  close: () => set({ modal: null }),
}));
