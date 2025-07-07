import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreComponent from "@/components/Store";

export default function Store() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">Магазин</h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Зарегистрируйте команду и получите официальный статус в турнирах
          </p>
        </div>

        <StoreComponent />
      </main>

      <Footer />
    </div>
  );
}
