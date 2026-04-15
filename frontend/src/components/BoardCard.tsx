import { Trash2 } from 'lucide-react';

interface BoardCardProps {
  board: {
    id: string;
    title: string;
    backgroundColor: string;
    backgroundImage?: string;
  };
  onClick: () => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export default function BoardCard({ board, onClick, onDelete }: BoardCardProps) {
  return (
    <div
      onClick={onClick}
      className="h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 relative group cursor-pointer"
      style={{
        backgroundColor: board.backgroundImage ? 'transparent' : board.backgroundColor,
        backgroundImage: board.backgroundImage ? `url(${board.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      <div className="relative h-full p-4 flex items-start justify-between">
        <h3 className="text-white font-semibold text-lg text-left truncate">{board.title}</h3>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="text-white/70 hover:text-red-400 hover:bg-black/30 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all z-10"
            title="Delete board"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
