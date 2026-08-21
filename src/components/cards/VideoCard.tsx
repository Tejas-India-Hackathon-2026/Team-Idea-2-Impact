import React, { useState } from 'react';
import { Play, Eye, Heart, Volume2, VolumeX } from 'lucide-react';
import { VideoStory } from '../../types';

interface VideoCardProps {
  story: VideoStory;
  onSelect?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ story, onSelect }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-44 sm:w-52 h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl group shrink-0 select-none">
      {/* Video or Thumbnail */}
      {isPlaying ? (
        <video
          src={story.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={story.thumbnail}
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80';
          }}
        />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
        <div className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-slate-700/60">
          {story.duration}
        </div>

        {isPlaying && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-slate-700/60"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-950/80 hover:scale-110 transition-transform z-10"
        >
          <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
        </button>
      )}

      {/* Bottom Info Content */}
      <div className="absolute bottom-3 inset-x-3 z-10 text-left">
        <div className="flex items-center gap-1.5 mb-1.5">
          <img
            src={story.sellerAvatar}
            alt={story.sellerName}
            className="w-6 h-6 rounded-full object-cover border border-emerald-400"
          />
          <span className="text-[11px] font-bold text-emerald-300 truncate">
            {story.sellerName}
          </span>
        </div>

        <h4 className="text-xs font-bold text-white leading-tight line-clamp-2 mb-2">
          {story.title}
        </h4>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3 text-slate-400" />
            {story.viewsCount}
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-semibold">
            <Heart className="w-3 h-3 fill-rose-500/20" />
            {story.likesCount}
          </span>
        </div>
      </div>
    </div>
  );
};
