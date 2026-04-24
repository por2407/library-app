import { create } from "zustand";

interface Reservation {
  bookId: string;
}

interface ReservationState {
  reservations: Reservation[];
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  removeReservation: (id: string) => void;
  isReserved: (id: string) => boolean;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  setReservations: (reservations) => set({ reservations }),
  addReservation: (reservation) =>
    set((state) => ({ reservations: [...state.reservations, reservation] })),
  removeReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((r) => r.bookId !== id),
    })),
  isReserved: (id: string) => get().reservations.some((r) => r.bookId === id),
}));
