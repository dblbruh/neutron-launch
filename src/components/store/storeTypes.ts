export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

export interface Skin {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const rarityColors = {
  common: "text-gray-400 border-gray-400",
  rare: "text-blue-400 border-blue-400",
  epic: "text-purple-400 border-purple-400",
  legendary: "text-yellow-400 border-yellow-400",
};

export const rarityLabels = {
  common: "Обычная",
  rare: "Редкая",
  epic: "Эпическая",
  legendary: "Легендарная",
};