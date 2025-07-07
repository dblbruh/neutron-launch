import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика входа
    console.log("Вход:", formData);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

      <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="LogIn" size={32} className="text-black" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Добро пожаловать!
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Войдите в свой аккаунт
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Введите email"
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Пароль
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded"
                />
                <Label htmlFor="remember" className="text-zinc-300 text-sm">
                  Запомнить меня
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
              >
                Забыли пароль?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold"
              size="lg"
            >
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Нет аккаунта?{" "}
              <Link
                to="/register"
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <div className="text-center mb-4">
              <p className="text-zinc-400 text-sm">Или войдите через</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <Icon name="Mail" size={16} className="mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <Icon name="Github" size={16} className="mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
