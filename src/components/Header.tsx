import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://cdn.poehali.dev/files/ffbab4cd-41e6-4c90-9cce-a53d16843226.png"
              alt="CHAMPLINK"
              className="h-8 w-8 py-0 my-0 mx-0 px-[1px] object-contain"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CHAMPLINK
            </h1>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Главная
            </Link>
            <Link
              to="/play"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Играть
            </Link>
            <Link
              to="/tournaments"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Турниры
            </Link>
            <Link
              to="/leaderboard"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Рейтинг
            </Link>
            <Link
              to="/friends"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Друзья
            </Link>
            <Link
              to="/store"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Магазин
            </Link>
            <Link
              to="/news"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Новости
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:text-white"
              >
                <Icon name="User" size={16} className="mr-2" />
                Профиль
              </Button>
            </Link>
            <Link to="/subscription">
              <Button
                size="sm"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
              >
                Подписка 150₽
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
