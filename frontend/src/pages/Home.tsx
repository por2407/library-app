import TopNavBar from "../components/TopNavBar";

export default function Home() {

  return (
    <>
      <TopNavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          ยินดีต้อนรับสู่ Library App
        </h1>
      </div>
    </>
  );
}