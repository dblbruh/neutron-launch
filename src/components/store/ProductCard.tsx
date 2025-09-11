import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Product } from "./storeTypes";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      className={`bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-all duration-300 ${
        product.popular ? "ring-2 ring-yellow-400" : ""
      }`}
    >
      <CardHeader className="text-center">
        {product.popular && (
          <Badge className="w-fit mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
            Популярное
          </Badge>
        )}
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon
            name={product.icon as any}
            size={32}
            className="text-yellow-400"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-white">
          {product.name}
        </CardTitle>
        <CardDescription className="text-zinc-400">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-center mb-6">
          <span className="text-4xl font-bold text-white">
            {product.price}₽
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Icon
                name="Check"
                size={16}
                className="text-green-400 flex-shrink-0"
              />
              <span className="text-zinc-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
          size="lg"
        >
          <Icon name="ShoppingCart" size={20} className="mr-2" />
          Купить
        </Button>
      </CardContent>
    </Card>
  );
}