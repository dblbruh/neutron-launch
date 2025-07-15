import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface LiveStreamProps {
  src: string;
  platform?: 'youtube' | 'twitch' | 'rutube' | 'vk' | 'custom';
  title?: string;
  width?: string;
  height?: string;
}

const LiveStream: React.FC<LiveStreamProps> = ({
  src,
  platform = 'twitch',
  title = 'Прямой эфир',
  width = '100%',
  height = '400px'
}) => {
  const [showIframe, setShowIframe] = useState(false);
  const [error, setError] = useState(false);
  
  const getEmbedUrl = (url: string, platform: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
        return youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1` : url;
      
      case 'twitch':
        const twitchChannel = url.match(/twitch\.tv\/([^/?&\n]+)/)?.[1];
        return twitchChannel ? `https://player.twitch.tv/?channel=${twitchChannel}&parent=${window.location.hostname}&parent=localhost&parent=poehali.dev` : url;
      
      case 'rutube':
        const rutubeId = url.match(/rutube\.ru\/video\/([^/?&\n]+)/)?.[1];
        return rutubeId ? `https://rutube.ru/play/embed/${rutubeId}` : url;
      
      case 'vk':
        const vkMatch = url.match(/vk\.com\/video(-?\d+_\d+)/)?.[1];
        return vkMatch ? `https://vk.com/video_ext.php?oid=${vkMatch.split('_')[0]}&id=${vkMatch.split('_')[1]}&hash=${vkMatch}` : url;
      
      default:
        return url;
    }
  };

  const getDirectUrl = (url: string) => {
    return url;
  };

  const embedUrl = getEmbedUrl(src, platform);
  const directUrl = getDirectUrl(src);

  const handleIframeError = () => {
    setError(true);
  };

  if (error || !showIframe) {
    return (
      <Card className="w-full bg-zinc-900/50 border border-zinc-700/50">
        <CardContent className="p-6">
          <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg flex flex-col items-center justify-center gap-4">
            <Icon name="Play" size={48} className="text-purple-400" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-400">
                {error ? 'Не удалось загрузить встроенный плеер' : 'Нажмите для просмотра стрима'}
              </p>
            </div>
            <div className="flex gap-3">
              {!error && (
                <Button 
                  onClick={() => setShowIframe(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Icon name="Play" size={16} className="mr-2" />
                  Включить плеер
                </Button>
              )}
              <Button 
                onClick={() => window.open(directUrl, '_blank')}
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
              >
                <Icon name="ExternalLink" size={16} className="mr-2" />
                Открыть на {platform === 'twitch' ? 'Twitch' : platform}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-zinc-900/50 border border-zinc-700/50">
      <CardContent className="p-4">
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
            onError={handleIframeError}
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm text-gray-300">{title}</p>
          <Button 
            onClick={() => setShowIframe(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveStream;