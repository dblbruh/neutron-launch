import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: "Gamepad2",
      title: "Играй онлайн",
      description: "Подключайся к матчам с игроками со всего мира",
      link: "/play",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "Trophy",
      title: "Турниры",
      description: "Участвуй в соревнованиях и выигрывай призы",
      link: "/tournaments",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: "Medal",
      title: "Рейтинг",
      description: "Соревнуйся за топовые позиции в таблице лидеров",
      link: "/leaderboard",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "Users",
      title: "Друзья",
      description: "Находи друзей и бросай им вызовы",
      link: "/friends",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Активных игроков", icon: "Users" },
    { value: "500+", label: "Турниров проведено", icon: "Trophy" },
    { value: "₽1M+", label: "Выплачено призов", icon: "Coins" },
    { value: "24/7", label: "Онлайн поддержка", icon: "Headphones" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 via-black to-black" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200')] bg-cover bg-center opacity-10" />
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-600/20">
              <Icon name="Sparkles" size={16} className="text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">Киберспортивная платформа </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Играй, Соревнуйся,
              <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                Побеждай
              </span>
            </h1>
            
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              CHAMPLINK — это место где встречаются лучшие игроки. 
              Участвуй в турнирах, поднимайся в рейтинге и зарабатывай реальные призы.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/play">
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 text-lg px-8 py-6">
                      <Icon name="Gamepad2" size={20} className="mr-2" />
                      Начать играть
                    </Button>
                  </Link>
                  <Link to="/tournaments">
                    <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-900 text-lg px-8 py-6">
                      <Icon name="Trophy" size={20} className="mr-2" />
                      Турниры
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 text-lg px-8 py-6">
                      <Icon name="Zap" size={20} className="mr-2" />
                      Начать бесплатно
                    </Button>
                  </Link>
                  <Link to="/tournaments">
                    <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-900 text-lg px-8 py-6">
                      <Icon name="PlayCircle" size={20} className="mr-2" />
                      Смотреть турниры
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-950/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <Icon name={stat.icon} size={32} className="mx-auto text-yellow-400 mb-3" />
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">Что мы предлагаем</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Всё необходимое для киберспортивной карьеры в одном месте
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:scale-105 h-full group cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon name={feature.icon} size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{feature.title}</h3>
                      <p className="text-zinc-400 text-sm">{feature.description}</p>
                    </div>
                    <div className="flex items-center text-yellow-400 text-sm font-medium">
                      Подробнее
                      <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border-yellow-600/20 overflow-hidden">
              <CardContent className="p-12 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-400/20 mb-4">
                  <Icon name="Crown" size={32} className="text-yellow-400" />
                </div>
                <h2 className="text-3xl font-bold">Получи Premium подписку</h2>
                <p className="text-zinc-300 text-lg max-w-2xl mx-auto">
                  Эксклюзивные турниры, уникальные скины и приоритетная поддержка уже ждут тебя
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link to="/subscription">
                    <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 text-lg px-8">
                      <Icon name="Sparkles" size={20} className="mr-2" />
                      Всего 150₽/мес
                    </Button>
                  </Link>
                  <Link to="/store">
                    <Button size="lg" variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-400/10 text-lg px-8">
                      <Icon name="ShoppingBag" size={20} className="mr-2" />
                      Магазин
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold">Почему выбирают нас</h2>
            <p className="text-zinc-400 text-lg">Честная игра, реальные призы, безопасность</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <Icon name="Shield" size={24} className="text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Безопасность</h3>
              <p className="text-zinc-400 text-sm">Защита данных и честная игра гарантированы</p>
            </div>
            
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                <Icon name="Zap" size={24} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold">Быстрые матчи</h3>
              <p className="text-zinc-400 text-sm">Подбор игры менее чем за 30 секунд</p>
            </div>
            
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
                <Icon name="Gift" size={24} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">Щедрые призы</h3>
              <p className="text-zinc-400 text-sm">Реальные деньги за победы в турнирах</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}