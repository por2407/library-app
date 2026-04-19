import TopNavBar from "../../components/TopNavBar";
import { useBooksStore } from "../../stores/books-store";
import { useState } from "react";
import ModalAddBook from "../../components/ModalAddBook";
import { booksApi } from "../../api/books-api";

export default function Management() {
  const { books, setBooks } = useBooksStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteBook = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบหนังสือเล่มนี้?")) return;
    try {
      await booksApi.deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("ลบหนังสือไม่สำเร็จ");
    }
  };

  return (
    <>
      <TopNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">
          การจัดการหนังสือ
        </h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            เพิ่มหนังสือ
          </button>
        </div>
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ชื่อหนังสือ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    รายละเอียด
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ปกหนังสือ
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    จำนวนทั้งหมด
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ยืมได้
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {books.map((book) => (
                  <tr
                    key={book.id}
                    className="hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{book.isbn}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-500 max-w-[200px] truncate"
                        title={book.description}
                      >
                        {book.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-12 w-9 object-cover mx-auto rounded shadow-sm border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {book.totalCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.availableCopies > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(book.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center space-x-4 whitespace-nowrap font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 transition-colors">
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}

                {books.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      ไม่พบข้อมูลหนังสือในระบบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalAddBook
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
