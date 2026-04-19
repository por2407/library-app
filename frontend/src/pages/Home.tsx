import { useEffect } from "react";
import TopNavBar from "../components/TopNavBar";
import CardBook from "../components/CardBook";
import { useBooksStore } from "../stores/books-store";
import { booksApi } from "../api/books-api";

export default function Home() {
  const { books, setBooks } = useBooksStore();

  useEffect(() => {
    const fetchBooks = async () => {
      const books = await booksApi.getBooks();
      setBooks(books);
    };
    fetchBooks();
  }, []);

  return (
    <>
      <TopNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ยินดีต้อนรับสู่ Library App
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <CardBook key={book.id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
}