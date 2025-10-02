import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import funcUrls from "../../backend/func2url.json";

interface SearchResult {
  id: number;
  username: string;
  displayName: string;
  points: number;
  level: number;
}

export default function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(true);

    try {
      const response = await fetch(`${funcUrls.content}?resource=user&search=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Icon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" 
        />
        <Input
          type="text"
          placeholder="Найти игроков..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
          className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <Icon name="X" size={18} />
          </button>
        )}
      </div>

      {showResults && (
        <Card className="absolute z-50 w-full mt-2 bg-zinc-900 border-zinc-800 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Icon name="Loader2" size={24} className="animate-spin text-yellow-400" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-zinc-400">
                <Icon name="Search" size={32} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm">Пользователи не найдены</p>
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((user) => (
                  <Link
                    key={user.id}
                    to={`/user/${user.username}`}
                    onClick={() => setShowResults(false)}
                    className="block p-3 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center font-bold text-black">
                          {user.displayName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.displayName}</p>
                          <p className="text-xs text-zinc-400">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                          <Icon name="Trophy" size={12} className="mr-1" />
                          Ур. {user.level}
                        </Badge>
                        <Badge variant="outline" className="border-zinc-700 text-zinc-300">
                          <Icon name="Coins" size={12} className="mr-1" />
                          {user.points}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
