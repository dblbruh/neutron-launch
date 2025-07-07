import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TournamentInfo from "@/components/TournamentInfo";
import Subscription from "@/components/Subscription";
import RegionalLeaderboards from "@/components/RegionalLeaderboards";
import Store from "@/components/Store";
import Footer from "@/components/Footer";

export default function Index() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <TournamentInfo />
      <Subscription />
      <RegionalLeaderboards />
      <Store />
      <Footer />
    </div>
  );
}
