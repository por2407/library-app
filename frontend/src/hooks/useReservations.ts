import { useEffect } from "react";
import { booksApi } from "../api/books-api";
import { useReservationStore } from "../stores/reservation-store";
import { useAuthStore } from "../stores/auth-store";

export const useReservations = () => {
  const { setReservations } = useReservationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setReservations([]);
      return;
    }
    const fetchReservations = async () => {
      try {
        const reservations = await booksApi.getReservations();
        setReservations(reservations);
      } catch (error) {
        console.error("Failed to fetch reservations", error);
      }
    };
    fetchReservations();
  }, [user, setReservations]);
};
