import { api } from "../lib/axios";
import type { Book } from "../stores/books-store";

export const booksApi = {
  async getBooks(): Promise<Book[]> {
    const response = await api.get("/books");
    return response.data.data;
  },
  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data.data;
  },
  async createBook(
    book: Omit<Book, "id" | "createdAt" | "availableCopies"> & {
      authors?: string[];
      categories?: string[];
    },
  ) {
    const response = await api.post("/books", book);
    return response.data.data;
  },
  async deleteBook(id: string) {
    const response = await api.delete(`/books/delete/${id}`);
    return response.data.message;
  },
  async updateBook(
    id: string,
    book: Omit<Book, "id" | "createdAt" | "availableCopies"> & {
      authors?: string[];
      categories?: string[];
    },
  ) {
    const response = await api.put(`/books/edit/${id}`, book);
    return response.data.data;
  },
  async getAuthors() {
    const response = await api.get("/authors");
    return response.data.data;
  },
  async getCategories() {
    const response = await api.get("/categories");
    return response.data.data;
  },
  async createAuthor(name: string) {
    const response = await api.post("/authors", { name });
    return response.data.data;
  },
  async createCategory(name: string) {
    const response = await api.post("/categories", { name });
    return response.data.data;
  },
  async deleteAuthor(id: string) {
    const response = await api.delete(`/authors/${id}`);
    return response.data.message;
  },
  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data.message;
  },
  async getReservations() {
    const response = await api.get("/books/reservations/my");
    return response.data.data;
  },
  async reserveBook(id: string) {
    const response = await api.post("/books/reserve", { bookId: id });
    return response.data.message;
  },
  async cancelReservation(id: string) {
    const response = await api.patch(`/books/reserve/${id}`);
    return response.data.message;
  },
  async borrowBook(id: string) {
    const response = await api.post(`/books/borrows/${id}`);
    return response.data.message;
  },
  async returnBook(id: string) {
    const response = await api.put(`/books/return/${id}`);
    return response.data.message;
  },
  async getMyBorrows() {
    const response = await api.get("/books/borrows/my");
    return response.data.data;
  },
  async historyBorrowAll(page: number = 1, limit: number = 10) {
    const response = await api.get(
      `/books/borrows/history-all?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
  async historyBorrowByUser(page: number = 1, limit: number = 10) {
    const response = await api.get(
      `/books/borrows/history?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
};
