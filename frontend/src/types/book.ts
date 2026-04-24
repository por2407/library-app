export interface Borrow {
  id: string;
  book: {
    id: string;
    title: string;
    coverUrl: string;
  };
  user: {
    id: string;
    name: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: string;
}
