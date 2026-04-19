import type {Book} from "../stores/books-store"
import {Link} from "react-router-dom"

export default function CardBook({book}: {book: Book}) {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <img src={book.coverUrl} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-4">{book.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-gray-500">จำนวนที่สามารถยืมได้ {book.availableCopies}/{book.totalCopies}</span>
                <Link to={`/book/${book.id}`} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">รายละเอียด</Link>
            </div>
        </div>
    )
}