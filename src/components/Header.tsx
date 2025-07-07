import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/img/a6ee8f4d-26f5-4ec3-ada3-dfa630021d75.jpg"
              alt="CS2 Tournament"
              className="h-8 w-8 rounded"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CS2 ARENA
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Главная
            </a>
            <a
              href="#"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Турниры
            </a>
            <a
              href="#"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Рейтинг
            </a>
            <a
              href="#"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Магазин
            </a>
            <a
              href="#"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Новости
            </a>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 text-zinc-300 hover:text-white"
            >
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
            >
              Подписка 150₽
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
