
import React, { useState } from 'react';
import { StoryChapter } from '../types';

interface StoryCardProps {
  chapter: StoryChapter;
  isActive: boolean;
  onNavigate: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ chapter, isActive, onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const getThemeStyles = () => {
    switch (chapter.theme) {
      case 'it': return 'border-cyan-500 shadow-cyan-900/20';
      case 'law': return 'border-amber-600 shadow-amber-900/20';
      default: return 'border-gray-700 shadow-black';
    }
  };

  const formatForSocial = () => {
    const emojiHeader = chapter.theme === 'it' ? '💻 🛡️' : chapter.theme === 'law' ? '⚖️ 📜' : '📖 ✨';
    const post = `${emojiHeader} 【 ${chapter.title} 】 ${emojiHeader}\n\n${chapter.content}\n\n#អន្ទាក់ស្នេហ៍ក្នុងក្រញាំច្បាប់ #សាច់រឿងអប់រំ #ITvsLaw #KhmerStory #Drama`;
    
    navigator.clipboard.writeText(post).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      className={`relative transition-all duration-500 overflow-hidden rounded-xl border-2 bg-zinc-900/50 backdrop-blur-sm ${getThemeStyles()} ${isActive ? 'ring-2 ring-blue-500/50' : 'opacity-80'}`}
    >
      <div className="relative h-48 w-full cursor-pointer" onClick={onNavigate}>
        <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <h3 className="text-xl font-bold text-white drop-shadow-md">{chapter.title}</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-zinc-300 leading-relaxed text-lg line-clamp-3">
          {chapter.content}
        </p>
        <div className="flex gap-2">
          <button 
            onClick={onNavigate}
            className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
          >
            អានបន្ថែម
          </button>
          <button 
            onClick={formatForSocial}
            className={`flex-1 py-2 flex items-center justify-center gap-2 text-sm font-bold rounded-lg transition-all border ${
              copied ? 'bg-green-600 border-green-500 text-white' : 'bg-blue-600/20 hover:bg-blue-600 border-blue-500/50 text-blue-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              )}
            </svg>
            {copied ? 'បានចម្លង!' : 'ចម្លងសម្រាប់ផុស'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
