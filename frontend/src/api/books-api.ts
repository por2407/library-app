import { api } from "../lib/axios";
import type { Book } from "../stores/books-store";

export const booksApi = {
    async getBooks(): Promise<Book[]> {
        const response = await api.get("/books");
        return response.data.data;
    },
    async createBook(book: Omit<Book, 'id' | 'createdAt' | 'availableCopies'> & { authors?: string[], categories?: string[] }) {
        const response = await api.post("/books", book);
        return response.data.data;
    },
    async deleteBook(id: string) {
        const response = await api.delete(`/books/delete/${id}`);
        return response.data.message;
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
    }
}