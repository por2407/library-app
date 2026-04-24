import { useEffect } from "react";
import { booksApi } from "../api/books-api";
import { useBorrowStore } from "../stores/borrow-store";
import { useAuthStore } from "../stores/auth-store";

export const useBorrows = () => {
  const { setBorrows } = useBorrowStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setBorrows([]);
      return;
    }
    const fetchBorrows = async () => {
      try {
        const borrows = await booksApi.getMyBorrows();
        // Filter only active borrows (status "BORROWED")
        const activeBorrows = borrows
          .filter((b: any) => b.status === "BORROWED")
          .map((b: any) => ({ bookId: b.bookId }));
        setBorrows(activeBorrows);
      } catch (error) {
        console.error("Failed to fetch borrows", error);
      }
    };
    fetchBorrows();
  }, [user, setBorrows]);
};
