import { useParams } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import { useBooksStore } from "../stores/books-store";
import { useState, useEffect } from "react";
import { type Book } from "../stores/books-store";

export default function DetailBook() {
  const { id } = useParams();
  const { books } = useBooksStore();
  const [detail, setDetail] = useState<Book | null>(null);

  useEffect(() => {
    const book = books.find((b) => b.id === id);
    if (book) {
      setDetail(book);
    }
  }, [books, id]);
  return (
    <>
      <TopNavBar />
      <div className="container mx-auto px-4 py-8">
        {detail ? (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img
                src={detail.coverUrl}
                alt={detail.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {detail.title}
              </h1>
              <p className="text-gray-600 mb-4">{detail.description}</p>
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="availableCopies">ยืมได้</label>
                <span className="text-gray-600">{detail.availableCopies}</span>
                <label htmlFor="totalCopies">ทั้งหมด</label>
                <span className="text-gray-600">{detail.totalCopies}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="isbn">ISBN</label>
                <span className="text-gray-600">{detail.isbn}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="authors">ผู้แต่ง</label>
                <span className="text-gray-600">
                  {detail.authors?.map((a) => a.author.name).join(", ")}
                </span>
              </div>
              <div>
                <label htmlFor="categories">ประเภทหมวดหมู่</label>
                <span className="text-gray-600">
                  {detail.categories?.map((c) => c.category.name).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="createdAt">วันที่</label>
                <span className="text-gray-600">
                  {new Date(detail.createdAt).toLocaleDateString("th-TH")}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                {detail.availableCopies > 0 &&
                detail.availableCopies <= detail.totalCopies ? (
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    ยืม
                  </button>
                ) : (
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    จอง
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">ไม่พบข้อมูลหนังสือ</div>
        )}
      </div>
    </>
  );
}
