import ProductCard from "./ProductCard";
import { products } from "./storeData";

export default function ProductsSection() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-8 text-center">
        Основные продукты
      </h2>
      <div className="grid lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}