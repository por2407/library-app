import { useParams } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";

export default function DetailBook() {
    const { id } = useParams();
    return (
        <>
            <TopNavBar />
            <div className="container mx-auto px-4 py-8">
                <h1>Detail Book</h1>
                <p>Book ID: {id}</p>
            </div>
        </>
    )
}