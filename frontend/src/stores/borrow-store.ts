import { create } from "zustand";

interface Borrow {
  bookId: string;
}

interface BorrowState {
  borrows: Borrow[];
  setBorrows: (borrows: Borrow[]) => void;
  addBorrow: (borrow: Borrow) => void;
  removeBorrow: (id: string) => void;
  isBorrowed: (id: string) => boolean;
}

export const useBorrowStore = create<BorrowState>((set, get) => ({
  borrows: [],
  setBorrows: (borrows) => set({ borrows }),
  addBorrow: (borrow) =>
    set((state) => ({ borrows: [...state.borrows, borrow] })),
  removeBorrow: (id) =>
    set((state) => ({
      borrows: state.borrows.filter((b) => b.bookId !== id),
    })),
  isBorrowed: (id: string) => get().borrows.some((b) => b.bookId === id),
}));
