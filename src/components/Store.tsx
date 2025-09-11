import { Separator } from "@/components/ui/separator";
import ProductsSection from "./store/ProductsSection";
import SkinsSection from "./store/SkinsSection";

export default function Store() {
  return (
    <div className="space-y-16">
      <ProductsSection />
      <Separator className="bg-zinc-800" />
      <SkinsSection />
    </div>
  );
}