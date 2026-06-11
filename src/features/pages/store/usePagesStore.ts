import { create } from "zustand";

export interface Page {
  id: string;
  name: string;
}

interface PagesState {
  pages: Page[];
  activePageId: string;

  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;
  setActivePage: (id: string) => void;
}

export const usePagesStore = create<PagesState>((set) => ({
  pages: [
    { id: "home", name: "Home" },
  ],

  activePageId: "home",

  addPage: (name) =>
    set((state) => ({
      pages: [
        ...state.pages,
        { id: crypto.randomUUID(), name },
      ],
    })),

  deletePage: (id) =>
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== id),
    })),

  renamePage: (id, name) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === id ? { id: p.id, name } : p
      ),
    })),

  setActivePage: (id) =>
    set({ activePageId: id }),
}));