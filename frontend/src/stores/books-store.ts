import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Book {
  id: string;
  title: string;
  isbn: string;
  description: string;
  coverUrl: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  authors?: { author: { id: string; name: string } }[];
  categories?: { category: { id: string; name: string } }[];
}

interface BookState {
  books: Book[];
  setBooks: (books: Book[]) => void;
  clearBooks: () => void;
}

export const useBooksStore = create<BookState>()(
  persist(
    (set) => ({
      books: [],
      setBooks: (books) => set({ books }),
      clearBooks: () => set({ books: [] }),
    }),
    {
      name: "books-storage",
      partialize: (state) => ({ books: state.books }),
    },
  ),
);
