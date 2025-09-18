import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";

export default function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (userData: any) => {
    login(userData);
  };

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
              to="/challenges"
              className="text-zinc-300 hover:text-white transition-colors"
            >
              Вызовы
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
            {isAuthenticated && user ? (
              // Если пользователь авторизован
              <>
                <div className="flex items-center space-x-2">
                  <Icon name="Coins" size={16} className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{user.points.toLocaleString()}</span>
                </div>
                <Link to="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-300 hover:text-white"
                  >
                    <Icon name="User" size={16} className="mr-2" />
                    {user.displayName || user.username}
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
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-300 hover:text-white"
                >
                  <Icon name="LogOut" size={16} className="mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              // Если пользователь не авторизован
              <>
                <Button
                  onClick={handleAuthClick}
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-300 hover:text-white"
                >
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Вход
                </Button>
                <Button
                  onClick={handleAuthClick}
                  size="sm"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                >
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={handleAuthSuccess}
      />
        </nav>
      </div>
    </header>
  );
}