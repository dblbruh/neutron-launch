import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TournamentInfo from "@/components/TournamentInfo";
import Subscription from "@/components/Subscription";
import RegionalLeaderboards from "@/components/RegionalLeaderboards";
import Store from "@/components/Store";
import Footer from "@/components/Footer";
import React from 'react';

// Компонент для встраивания прямой трансляции
interface LiveStreamProps {
  src: string;
  platform?: 'youtube' | 'twitch' | 'rutube' | 'vk' | 'custom';
  title?: string;
}

const LiveStream: React.FC<LiveStreamProps> = ({
  src,
  platform = 'custom',
  title = 'Прямая трансляция'
}) => {
  const getEmbedUrl = (url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1` : url;
      
      case 'twitch':
        const twitchChannel = url.match(/twitch\.tv\/([^/?&\n]+)/)?.[1];
        return twitchChannel ? `https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}` : url;
      
      case 'rutube':
        const rutubeId = url.match(/rutube\.ru\/video\/([^/?&\n]+)/)?.[1];
        return rutubeId ? `https://rutube.ru/play/embed/${rutubeId}` : url;
      
      case 'vk':
        const vkMatch = url.match(/vk\.com\/video(-?\d+_\d+)/)?.[1];
        return vkMatch ? `https://vk.com/video_ext.php?oid=${vkMatch.split('_')[0]}&id=${vkMatch.split('_')[1]}` : url;
      
      default:
        return url;
    }
  };

  return (
    <div className="w-full">
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <iframe
          src={getEmbedUrl(src, platform)}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full"
        />
      </div>
      <p className="text-sm text-gray-400 mt-2 text-center">{title}</p>
    </div>
  );
};

export default function Index() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      
      {/* Секция с прямой трансляцией */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            🔴 Прямая трансляция
          </h2>
          <LiveStream 
            src="https://www.twitch.tv/dblbruh"
            platform="twitch"
            title="Стрим dblbruh - прямой эфир"
          />
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Чтобы встроить свою трансляцию, замените YOUR_VIDEO_ID на ID вашего видео
            </p>
            <p className="text-gray-400 text-xs">
              Поддерживаются: YouTube, Twitch, RuTube, VK Video
            </p>
          </div>
        </div>
      </section>
      
      <TournamentInfo />
      <Subscription />
      <RegionalLeaderboards />
      <Store />
      <Footer />
    </div>
  );
}