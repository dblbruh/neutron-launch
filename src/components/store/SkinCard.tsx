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
import { Skin, rarityColors, rarityLabels } from "./storeTypes";

interface SkinCardProps {
  skin: Skin;
  playerPoints: number;
}

export default function SkinCard({ skin, playerPoints }: SkinCardProps) {
  const canAfford = playerPoints >= skin.price;

  return (
    <Card
      className={`bg-zinc-900/50 border-zinc-800 hover:border-yellow-500 transition-all duration-300 ${
        !canAfford ? "opacity-60" : ""
      }`}
    >
      <CardHeader className="text-center pb-2 p-3">
        <div className="mb-1">
          <img
            src={skin.image}
            alt={skin.name}
            className="w-16 h-12 object-cover mx-auto rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = document.createElement("div");
              fallback.textContent = "🔫";
              fallback.className = "text-4xl";
              target.parentNode?.appendChild(fallback);
            }}
          />
        </div>
        <Badge
          variant="outline"
          className={`w-fit mx-auto mb-1 text-xs ${rarityColors[skin.rarity]}`}
        >
          {rarityLabels[skin.rarity]}
        </Badge>
        <CardTitle className="text-sm font-bold text-white leading-tight">
          {skin.name}
        </CardTitle>
        <CardDescription className="text-zinc-400 text-xs leading-tight">
          {skin.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 p-3">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center space-x-1">
            <Icon
              name="Coins"
              size={14}
              className="text-yellow-400"
            />
            <span className="text-lg font-bold text-white">
              {skin.price}
            </span>
          </div>
        </div>

        <Button
          className={`w-full text-xs h-8 ${
            canAfford
              ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
              : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
          }`}
          disabled={!canAfford}
        >
          {canAfford ? (
            <>
              <Icon name="ShoppingBag" size={14} className="mr-1" />
              Купить
            </>
          ) : (
            <>
              <Icon name="Lock" size={14} className="mr-1" />
              Недостаточно
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}