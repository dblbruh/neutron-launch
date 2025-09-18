import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  points: number;
  level: number;
  wins?: number;
  losses?: number;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, onAuth }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });

  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://functions.poehali.dev/49e260c2-e6f1-43ca-b561-c22af980a7cb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "register",
          ...registerData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Регистрация прошла успешно! Добро пожаловать!");
        onAuth(result.user);
        setTimeout(() => {
          onClose();
          setRegisterData({ username: "", email: "", password: "", displayName: "" });
          setSuccess("");
        }, 1500);
      } else {
        setError(result.error || "Ошибка регистрации");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("https://functions.poehali.dev/49e260c2-e6f1-43ca-b561-c22af980a7cb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          ...loginData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Вход выполнен успешно!");
        onAuth(result.user);
        setTimeout(() => {
          onClose();
          setLoginData({ login: "", password: "" });
          setSuccess("");
        }, 1500);
      } else {
        setError(result.error || "Ошибка входа");
      }
    } catch (err) {
      setError("Ошибка подключения к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Icon name="UserPlus" size={20} />
            <span>Вход в аккаунт</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
            <TabsTrigger value="login" className="text-zinc-300 data-[state=active]:text-white">
              Вход
            </TabsTrigger>
            <TabsTrigger value="register" className="text-zinc-300 data-[state=active]:text-white">
              Регистрация
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert className="bg-red-900/20 border-red-500/50 mt-4">
              <Icon name="AlertCircle" size={16} className="text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900/20 border-green-500/50 mt-4">
              <Icon name="CheckCircle" size={16} className="text-green-400" />
              <AlertDescription className="text-green-400">{success}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login" className="text-zinc-300">
                  Логин или Email
                </Label>
                <Input
                  id="login"
                  type="text"
                  value={loginData.login}
                  onChange={(e) => setLoginData({ ...loginData, login: e.target.value })}
                  className="bg-zinc-800 border-zinc-600 text-white mt-1"
                  placeholder="Введите логин или email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="loginPassword" className="text-zinc-300">
                  Пароль
                </Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="bg-zinc-800 border-zinc-600 text-white mt-1"
                  placeholder="Введите пароль"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Вход...
                  </>
                ) : (
                  <>
                    <Icon name="LogIn" size={16} className="mr-2" />
                    Войти
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-zinc-300">
                  Логин
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  className="bg-zinc-800 border-zinc-600 text-white mt-1"
                  placeholder="Уникальный логин (латиница)"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="bg-zinc-800 border-zinc-600 text-white mt-1"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="displayName" className="text-zinc-300">
                  Отображаемое имя
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={registerData.displayName}
                  onChange={(e) => setRegisterData({ ...registerData, displayName: e.target.value })}
                  className="bg-zinc-800 border-zinc-600 text-white mt-1"
                  placeholder="Как вас будут видеть другие (опционально)"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-zinc-300">
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="bg-zinc-800 border-zinc-600 text-white mt-1"
                  placeholder="Минимум 6 символов"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Регистрация...
                  </>
                ) : (
                  <>
                    <Icon name="UserPlus" size={16} className="mr-2" />
                    Зарегистрироваться
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}