import { useState, useEffect } from "react";
import Select from "react-select";
import { booksApi } from "../api/books-api";
import { useBooksStore } from "../stores/books-store";

interface ModalAddBookProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalAddBook({ isOpen, onClose }: ModalAddBookProps) {
  const { setBooks } = useBooksStore();
  
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    description: "",
    coverUrl: "",
    totalCopies: 1,
  });

  const [selectedAuthors, setSelectedAuthors] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [authorOptions, setAuthorOptions] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  const loadOptions = async () => {
    try {
      const authData = await booksApi.getAuthors();
      const catData = await booksApi.getCategories();
      
      setAuthorOptions(
        authData.map((a: any) => ({ value: a.name, label: a.name, id: a.id }))
      );
      setCategoryOptions(
        catData.map((c: any) => ({ value: c.name, label: c.name, id: c.id }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewAuthor = async () => {
    if (!newAuthorName.trim()) return;
    setIsLoading(true);
    try {
      const newAuthor = await booksApi.createAuthor(newAuthorName);
      const newOption = { value: newAuthor.name, label: newAuthor.name, id: newAuthor.id };
      setAuthorOptions((prev) => [...prev, newOption]);
      setSelectedAuthors((prev) => [...prev, newOption]);
      setNewAuthorName("");
    } catch (error: any) {
      alert("สร้างผู้แต่งไม่สำเร็จ: " + (error.response?.data?.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAuthorDB = async (id: string, name: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้แต่ง "${name}" ออกจากระบบ?`)) return;
    setIsLoading(true);
    try {
      await booksApi.deleteAuthor(id);
      setAuthorOptions((prev) => prev.filter(a => a.id !== id));
      setSelectedAuthors((prev) => prev.filter(a => a.id !== id));
    } catch (error: any) {
      alert("ลบไม่สำเร็จ: " + (error.response?.data?.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsLoading(true);
    try {
      const newCat = await booksApi.createCategory(newCategoryName);
      const newOption = { value: newCat.name, label: newCat.name, id: newCat.id };
      setCategoryOptions((prev) => [...prev, newOption]);
      setSelectedCategories((prev) => [...prev, newOption]);
      setNewCategoryName("");
    } catch (error: any) {
      alert("สร้างหมวดหมู่ไม่สำเร็จ: " + (error.response?.data?.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategoryDB = async (id: string, name: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${name}" ออกจากระบบ?`)) return;
    setIsLoading(true);
    try {
      await booksApi.deleteCategory(id);
      setCategoryOptions((prev) => prev.filter(c => c.id !== id));
      setSelectedCategories((prev) => prev.filter(c => c.id !== id));
    } catch (error: any) {
      alert("ลบไม่สำเร็จ: " + (error.response?.data?.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        totalCopies: Number(formData.totalCopies),
        authors: selectedAuthors.map((a: any) => a.value),
        categories: selectedCategories.map((c: any) => c.value),
      };
      
      await booksApi.createBook(dataToSubmit);
      // Deth and refetch new books
      const freshBooks = await booksApi.getBooks();
      setBooks(freshBooks);
      
      // Close modal and reset form
      setFormData({
        title: "",
        isbn: "",
        description: "",
        coverUrl: "",
        totalCopies: 1,
      });
      setSelectedAuthors([]);
      setSelectedCategories([]);
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มหนังสือ");
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">เพิ่มหนังสือใหม่</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="addBookForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อหนังสือ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="กรอกชื่อหนังสือ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="เช่น 978-3-16-148410-0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                รายละเอียดหนังสือ
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                placeholder="คำอธิบายสั้นๆ เกี่ยวกับหนังสือ..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ผู้แต่ง 
                </label>
                <div className="font-sans text-sm mb-2">
                  <Select
                    isMulti
                    options={authorOptions}
                    value={selectedAuthors}
                    onChange={(newValue) => setSelectedAuthors(newValue as any[])}
                    isDisabled={isLoading}
                    placeholder="ค้นหาและเลือกผู้แต่ง..."
                    noOptionsMessage={() => "ไม่มีผู้แต่งในระบบ"}
                  />
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 mb-2">จัดการผู้แต่งในระบบ (เพิ่ม/ลบ)</div>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newAuthorName} 
                      onChange={(e) => setNewAuthorName(e.target.value)} 
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 outline-none" 
                      placeholder="ชื่อผู้แต่งใหม่..." 
                    />
                    <button type="button" onClick={handleAddNewAuthor} disabled={isLoading || !newAuthorName.trim()} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors disabled:opacity-50">เพิ่ม</button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto w-full">
                    {authorOptions.map((a) => (
                      <span key={a.id} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                        {a.label}
                        <button type="button" onClick={() => handleDeleteAuthorDB(a.id, a.label)} className="text-red-400 hover:text-red-600 font-bold ml-1 outline-none">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ประเภทหมวดหมู่
                </label>
                <div className="font-sans text-sm mb-2">
                  <Select
                    isMulti
                    options={categoryOptions}
                    value={selectedCategories}
                    onChange={(newValue) => setSelectedCategories(newValue as any[])}
                    isDisabled={isLoading}
                    placeholder="ค้นหาและเลือกหมวดหมู่..."
                    noOptionsMessage={() => "ไม่มีหมวดหมู่ในระบบ"}
                  />
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 mb-2">จัดการหมวดหมู่ในระบบ (เพิ่ม/ลบ)</div>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)} 
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 outline-none" 
                      placeholder="ชื่อหมวดหมู่ใหม่..." 
                    />
                    <button type="button" onClick={handleAddNewCategory} disabled={isLoading || !newCategoryName.trim()} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded transition-colors disabled:opacity-50">เพิ่ม</button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto w-full">
                    {categoryOptions.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                        {c.label}
                        <button type="button" onClick={() => handleDeleteCategoryDB(c.id, c.label)} className="text-red-400 hover:text-red-600 font-bold ml-1 outline-none">&times;</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  จำนวน (เล่ม) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalCopies"
                  min="1"
                  required
                  value={formData.totalCopies}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL ภาพปก
                </label>
                <input
                  type="url"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                  placeholder="https://..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="addBookForm"
            disabled={isLoading}
            className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? "กำลังบันทึก..." : "อัปโหลดเล่มใหม่"}
          </button>
        </div>
      </div>
    </div>
  );
}
