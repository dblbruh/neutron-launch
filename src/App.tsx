import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Subscription from "./pages/Subscription";
import Play from "./pages/Play";
import Lobby from "./pages/Lobby";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import Leaderboard from "./pages/Leaderboard";
import Tournaments from "./pages/Tournaments";
import Challenges from "./pages/Challenges";
import Store from "./pages/Store";
import News from "./pages/News";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/play" element={<Play />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/settings" element={<ProfileSettings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/store" element={<Store />} />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/user/:username" element={<UserProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;