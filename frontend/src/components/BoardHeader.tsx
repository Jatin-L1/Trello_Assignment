'use client';

import { useState } from 'react';
import { Star, Users, Filter } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';

interface BoardHeaderProps {
  board: {
    id: string;
    title: string;
    is_starred?: boolean;
    members?: any[];
  };
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const { updateBoard } = useBoardStore();

  const handleSave = async () => {
    if (title.trim() && title !== board.title) {
      await updateBoard(board.id, { title: title.trim() });
    }
    setIsEditing(false);
  };

  const toggleStar = async () => {
    await updateBoard(board.id, { is_starred: !board.is_starred });
  };

  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="bg-white/90 text-trello-gray-900 px-3 py-1 rounded font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-white"
            autoFocus
          />
        ) : (
          <h2
            onClick={() => setIsEditing(true)}
            className="text-white font-semibold text-lg cursor-pointer hover:bg-white/10 px-3 py-1 rounded transition-colors"
          >
            {board.title}
          </h2>
        )}
        
        <button
          onClick={toggleStar}
          className={`p-1.5 rounded transition-colors ${
            board.is_starred
              ? 'text-yellow-400 hover:bg-white/10'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Star className={`w-5 h-5 ${board.is_starred ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>
        
        <div className="flex items-center">
          {board.members?.slice(0, 4).map((member, index) => (
            <div
              key={member.id}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium -ml-2 first:ml-0"
              style={{ zIndex: 10 - index }}
              title={member.full_name}
            >
              {member.full_name?.charAt(0).toUpperCase()}
            </div>
          ))}
          <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white flex items-center justify-center text-white -ml-2 transition-colors">
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
