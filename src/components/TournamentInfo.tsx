import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tournamentStages = [
  {
    stage: 1,
    title: "Онлайн отбор",
    duration: "1 месяц",
    description:
      "5 лучших игроков из каждого региона России получают приглашение",
  },
  {
    stage: 2,
    title: "Финальный отбор",
    duration: "До 32 команд",
    description:
      "Онлайн турнир среди приглашенных до определения 32 лучших команд",
  },
  {
    stage: 3,
    title: "LAN финал",
    duration: "Главный турнир",
    description: "Очный турнир между 32 лучшими командами за главный приз",
  },
];

export default function TournamentInfo() {
  return (
    <section className="py-16 bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Как проходит турнир</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Турнир проводится в несколько этапов с честным подбором игроков и
            региональными отборами
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tournamentStages.map((stage) => (
            <Card key={stage.stage} className="bg-zinc-800/50 border-zinc-700">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">
                    {stage.stage}
                  </span>
                </div>
                <CardTitle className="text-white">{stage.title}</CardTitle>
                <CardDescription className="text-zinc-400">
                  {stage.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-zinc-300">{stage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
