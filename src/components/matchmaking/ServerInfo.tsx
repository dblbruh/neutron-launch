import { Badge } from "@/components/ui/badge";
import { SERVERS } from "@/data/matchmaking";

interface ServerInfoProps {
  selectedServer: string;
}

export default function ServerInfo({ selectedServer }: ServerInfoProps) {
  if (!selectedServer) return null;

  return (
    <div className="p-4 bg-zinc-800/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Выбранный сервер</h4>
          <p className="text-sm text-zinc-400">{selectedServer}</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          {SERVERS[0].ping}ms
        </Badge>
      </div>
    </div>
  );
}
