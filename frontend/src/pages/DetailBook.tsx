import { useParams } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import { useState, useEffect } from "react";
import { type Book } from "../stores/books-store";
import { useAuthStore } from "../stores/auth-store";
import { useReservationStore } from "../stores/reservation-store";
import { useBorrowStore } from "../stores/borrow-store";
import { booksApi } from "../api/books-api";

export default function DetailBook() {
  const { id } = useParams();
  const [detail, setDetail] = useState<Book | null>(null);
  const { isReserved, addReservation, removeReservation } =
    useReservationStore();
  const { isBorrowed, addBorrow, removeBorrow } = useBorrowStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const book = await booksApi.getBookById(id);
        if (book) {
          setDetail(book);
        }
      } catch (err: unknown) {
        console.log(
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ",
        );
      }
    };
    fetchDetail();
  }, [id]);

  const handleBorrowBook = async () => {
    if (!id) return;
    try {
      await booksApi.borrowBook(id);
      addBorrow({ bookId: id });
      setDetail((prev) =>
        prev ? { ...prev, availableCopies: prev.availableCopies - 1 } : null,
      );
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "เกิดข้อผิดพลาดในการยืมหนังสือ",
      );
    }
  };

  const handleReturnBook = async () => {
    if (!id) return;
    try {
      await booksApi.returnBook(id);
      removeBorrow(id);
      setDetail((prev) =>
        prev ? { ...prev, availableCopies: prev.availableCopies + 1 } : null,
      );
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "เกิดข้อผิดพลาดในการคืนหนังสือ",
      );
    }
  };

  const handleReserveBook = async () => {
    if (!id) return;
    try {
      await booksApi.reserveBook(id);
      addReservation({ bookId: id });
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "เกิดข้อผิดพลาดในการจองหนังสือ",
      );
    }
  };

  const handleCancelReservation = async () => {
    if (!id) return;
    try {
      await booksApi.cancelReservation(id);
      removeReservation(id);
    } catch (err: unknown) {
      alert(
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "เกิดข้อผิดพลาดในการยกเลิกการจอง",
      );
    }
  };

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

              {user?.role === "USER" && (
                <div className="flex items-center gap-4 mb-4">
                  {isBorrowed(id!) ? (
                    <button
                      onClick={() => handleReturnBook()}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      คืน
                    </button>
                  ) : detail.availableCopies > 0 &&
                    detail.availableCopies <= detail.totalCopies ? (
                    <button
                      onClick={() => handleBorrowBook()}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                      ยืม
                    </button>
                  ) : isReserved(id!) ? (
                    <button
                      onClick={() => handleCancelReservation()}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      ยกเลิกจอง
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReserveBook()}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      จอง
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">ไม่พบข้อมูลหนังสือ</div>
        )}
      </div>
    </>
  );
}
