import React from 'react';

interface LiveStreamProps {
  src: string;
  platform?: 'youtube' | 'twitch' | 'rutube' | 'vk' | 'custom';
  title?: string;
  width?: string;
  height?: string;
}

const LiveStream: React.FC<LiveStreamProps> = ({
  src,
  platform = 'custom',
  title = 'Прямая трансляция',
  width = '100%',
  height = '400px'
}) => {
  const getEmbedUrl = (url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        // Извлекаем ID видео из URL
        const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1` : url;
      
      case 'twitch':
        // Извлекаем канал из URL
        const twitchChannel = url.match(/twitch\.tv\/([^/?&\n]+)/)?.[1];
        return twitchChannel ? `https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}` : url;
      
      case 'rutube':
        // Извлекаем ID видео из RuTube URL
        const rutubeId = url.match(/rutube\.ru\/video\/([^/?&\n]+)/)?.[1];
        return rutubeId ? `https://rutube.ru/play/embed/${rutubeId}` : url;
      
      case 'vk':
        // VK Video
        const vkMatch = url.match(/vk\.com\/video(-?\d+_\d+)/)?.[1];
        return vkMatch ? `https://vk.com/video_ext.php?oid=${vkMatch.split('_')[0]}&id=${vkMatch.split('_')[1]}&hash=${vkMatch}` : url;
      
      default:
        return url;
    }
  };

  const embedUrl = getEmbedUrl(src, platform);

  return (
    <div className="w-full">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          title={title}
          width={width}
          height={height}
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full"
        />
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">{title}</p>
    </div>
  );
};

export default LiveStream;