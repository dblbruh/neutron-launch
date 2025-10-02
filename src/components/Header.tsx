import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserSearch from "@/components/UserSearch";
import funcUrls from "../../backend/func2url.json";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadFriendRequestsCount();
      const interval = setInterval(loadFriendRequestsCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  const loadFriendRequestsCount = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`${funcUrls.content}?resource=friends&user_id=${user.id}&requests=true`);
      if (response.ok) {
        const data = await response.json();
        setFriendRequestsCount(data.length);
      }
    } catch (error) {
      console.error('Failed to load friend requests count:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="https://cdn.poehali.dev/files/ffbab4cd-41e6-4c90-9cce-a53d16843226.png"
              alt="CHAMPLINK"
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent hidden sm:block">
              CHAMPLINK
            </h1>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm"
                className={isActive('/') ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'}
              >
                <Icon name="Home" size={16} className="mr-2" />
                Главная
              </Button>
            </Link>
            <Link to="/play">
              <Button 
                variant="ghost" 
                size="sm"
                className={isActive('/play') ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'}
              >
                <Icon name="Gamepad2" size={16} className="mr-2" />
                Играть
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button 
                variant="ghost" 
                size="sm"
                className={isActive('/tournaments') ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'}
              >
                <Icon name="Trophy" size={16} className="mr-2" />
                Турниры
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button 
                variant="ghost" 
                size="sm"
                className={isActive('/leaderboard') ? 'text-yellow-400' : 'text-zinc-400 hover:text-white'}
              >
                <Icon name="Medal" size={16} className="mr-2" />
                Рейтинг
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="text-zinc-400 hover:text-white"
            >
              <Icon name="Search" size={18} />
            </Button>
            
            {isAuthenticated && user ? (
              <>
                <Link to="/friends?tab=requests">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white relative"
                  >
                    <Icon name="Bell" size={18} />
                    {friendRequestsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                        {friendRequestsCount > 9 ? '9' : friendRequestsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <Icon name="Coins" size={16} className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">{user.points.toLocaleString()}</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-300 hover:text-white"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center font-bold text-black text-sm">
                        {(user.displayName || user.username)[0].toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-zinc-900 border-zinc-800" align="end">
                    <div className="px-2 py-2 text-sm">
                      <p className="font-semibold text-white">{user.displayName || user.username}</p>
                      <p className="text-xs text-zinc-400">@{user.username}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    
                    <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800" asChild>
                      <Link to="/profile" className="flex items-center cursor-pointer">
                        <Icon name="User" size={16} className="mr-2" />
                        Мой профиль
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800" asChild>
                      <Link to="/profile/settings" className="flex items-center cursor-pointer">
                        <Icon name="Settings" size={16} className="mr-2" />
                        Настройки профиля
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800" asChild>
                      <Link to="/friends" className="flex items-center cursor-pointer">
                        <Icon name="Users" size={16} className="mr-2" />
                        Друзья
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800" asChild>
                      <Link to="/challenges" className="flex items-center cursor-pointer">
                        <Icon name="Swords" size={16} className="mr-2" />
                        Вызовы
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800" asChild>
                      <Link to="/store" className="flex items-center cursor-pointer">
                        <Icon name="ShoppingBag" size={16} className="mr-2" />
                        Магазин
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800" asChild>
                      <Link to="/news" className="flex items-center cursor-pointer">
                        <Icon name="Newspaper" size={16} className="mr-2" />
                        Новости
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-zinc-800" />
                    
                    <DropdownMenuItem className="text-zinc-300 focus:text-white focus:bg-zinc-800" asChild>
                      <Link to="/subscription" className="flex items-center cursor-pointer">
                        <Icon name="Crown" size={16} className="mr-2 text-yellow-400" />
                        <span className="text-yellow-400">Подписка Premium</span>
                      </Link>
                    </DropdownMenuItem>

                    {user.isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-zinc-800" />
                        <DropdownMenuItem className="text-yellow-400 focus:text-yellow-300 focus:bg-zinc-800" asChild>
                          <Link to="/admin" className="flex items-center cursor-pointer">
                            <Icon name="Shield" size={16} className="mr-2" />
                            Админ-панель
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    
                    <DropdownMenuItem 
                      className="text-red-400 focus:text-red-300 focus:bg-zinc-800 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-300 hover:text-white"
                  >
                    Вход
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
                  >
                    Регистрация
                  </Button>
                </Link>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-zinc-400 hover:text-white"
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 border-t border-zinc-800 pt-4">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm"
                className={`w-full justify-start ${isActive('/') ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400'}`}
              >
                <Icon name="Home" size={16} className="mr-2" />
                Главная
              </Button>
            </Link>
            <Link to="/play" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm"
                className={`w-full justify-start ${isActive('/play') ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400'}`}
              >
                <Icon name="Gamepad2" size={16} className="mr-2" />
                Играть
              </Button>
            </Link>
            <Link to="/tournaments" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm"
                className={`w-full justify-start ${isActive('/tournaments') ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400'}`}
              >
                <Icon name="Trophy" size={16} className="mr-2" />
                Турниры
              </Button>
            </Link>
            <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm"
                className={`w-full justify-start ${isActive('/leaderboard') ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400'}`}
              >
                <Icon name="Medal" size={16} className="mr-2" />
                Рейтинг
              </Button>
            </Link>
            <Link to="/challenges" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm"
                className={`w-full justify-start ${isActive('/challenges') ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400'}`}
              >
                <Icon name="Swords" size={16} className="mr-2" />
                Вызовы
              </Button>
            </Link>
            <Link to="/store" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm"
                className={`w-full justify-start ${isActive('/store') ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400'}`}
              >
                <Icon name="ShoppingBag" size={16} className="mr-2" />
                Магазин
              </Button>
            </Link>
            <Link to="/news" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                size="sm"
                className={`w-full justify-start ${isActive('/news') ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-400'}`}
              >
                <Icon name="Newspaper" size={16} className="mr-2" />
                Новости
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-white">Поиск игроков</DialogTitle>
          </DialogHeader>
          <UserSearch />
        </DialogContent>
      </Dialog>
    </header>
  );
}