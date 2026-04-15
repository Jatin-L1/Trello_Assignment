import React from 'react';
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
      className="h-[96px] rounded-[3px] overflow-hidden shadow-none hover:shadow-sm transition-all duration-200 relative group cursor-pointer border-none p-0 box-border flex flex-col"
      style={{
        backgroundColor: board.backgroundImage ? 'transparent' : board.backgroundColor,
        backgroundImage: board.backgroundImage ? `url(${board.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 transition-colors bg-black/10 hover:bg-black/20" />
      <div className="relative h-full flex flex-col justify-start w-full px-4 py-2">
        <h3 className="text-white font-[700] text-[16px] leading-[20px] text-left truncate overflow-hidden text-ellipsis drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] w-full">{board.title}</h3>
      </div>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="absolute bottom-2 right-2 text-white hover:text-white hover:bg-black/30 w-[24px] h-[24px] rounded-[3px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
          title="Delete board"
        >
          <Trash2 className="w-[14px] h-[14px]" />
        </button>
      )}
    </div>
  );
}
