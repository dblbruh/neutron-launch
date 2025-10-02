import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import func2url from "../../backend/func2url.json";

const RUSSIAN_REGIONS = [
  "Москва",
  "Санкт-Петербург",
  "Московская область",
  "Ленинградская область",
  "Новосибирская область",
  "Свердловская область",
  "Нижегородская область",
  "Казань",
  "Челябинская область",
  "Омская область",
  "Самарская область",
  "Ростовская область",
  "Уфа",
  "Красноярский край",
  "Воронежская область",
  "Пермский край",
  "Волгоградская область",
  "Краснодарский край",
  "Саратовская область",
  "Тюменская область",
  "Республика Татарстан",
  "Республика Башкортостан",
  "Другой регион"
];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    region: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают!",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Слишком короткий пароль",
        description: "Минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.region || !formData.age) {
      toast({
        title: "Заполните все поля",
        description: "Укажите регион и возраст",
        variant: "destructive",
      });
      return;
    }

    const age = parseInt(formData.age);
    if (age < 13 || age > 100) {
      toast({
        title: "Неверный возраст",
        description: "Возраст должен быть от 13 до 100 лет",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(func2url.auth, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          username: formData.username,
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName || formData.username,
          region: formData.region,
          age: age,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        toast({
          title: "Регистрация успешна!",
          description: `Добро пожаловать, ${data.user.displayName}!`,
        });
        navigate('/');
      } else {
        toast({
          title: "Ошибка регистрации",
          description: data.error || "Не удалось создать аккаунт",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Не удалось подключиться к серверу",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>

      <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="UserPlus" size={32} className="text-black" />
          </div>
          <CardTitle className="text-2xl font-bold">Создать аккаунт</CardTitle>
          <CardDescription className="text-zinc-400">
            {step === 1 ? 'Шаг 1 из 2: Основная информация' : 'Шаг 2 из 2: Регион и возраст'}
          </CardDescription>
          
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-yellow-400' : 'bg-zinc-700'}`}></div>
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-yellow-400' : 'bg-zinc-700'}`}></div>
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">
                  Имя пользователя *
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="nickname"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-zinc-500">Уникальный идентификатор, нельзя изменить</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-zinc-300">
                  Отображаемое имя
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Ваше имя (можно изменить в настройках)"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                  disabled={isLoading}
                />
                <p className="text-xs text-zinc-500">Необязательно, можно изменить позже</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Пароль *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Минимум 6 символов"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-zinc-300">
                  Подтвердите пароль *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Повторите пароль"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold"
                size="lg"
              >
                Далее
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="region" className="text-zinc-300">
                  Регион проживания *
                </Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData({ ...formData, region: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                    <SelectValue placeholder="Выберите регион" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white max-h-[300px]">
                    {RUSSIAN_REGIONS.map((region) => (
                      <SelectItem key={region} value={region} className="focus:bg-zinc-700">
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">⚠️ Нельзя будет изменить после регистрации</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-zinc-300">
                  Возраст *
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ваш возраст"
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
                  required
                  min={13}
                  max={100}
                  disabled={isLoading}
                />
                <p className="text-xs text-zinc-500">Можно скрыть в настройках профиля</p>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-zinc-300">
                    <p className="font-medium text-blue-400 mb-1">Почему это важно?</p>
                    <p>Регион используется для региональных турниров и рейтингов. Возраст помогает создать безопасное игровое сообщество.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-zinc-700 text-zinc-300"
                  disabled={isLoading}
                >
                  <Icon name="ArrowLeft" size={20} className="mr-2" />
                  Назад
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    <>
                      <Icon name="Check" size={20} className="mr-2" />
                      Создать
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-zinc-400">
              Уже есть аккаунт?{" "}
              <Link
                to="/login"
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                Войти
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
