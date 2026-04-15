'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';

interface CreateListButtonProps {
  boardId: string;
}

export default function CreateListButton({ boardId }: CreateListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const { createList } = useBoardStore();

  const handleCreate = async () => {
    if (title.trim()) {
      await createList(boardId, title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-72 flex-shrink-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 text-white transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add another list</span>
      </button>
    );
  }

  return (
    <div className="w-72 flex-shrink-0 bg-trello-gray-100 rounded-lg p-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleCreate();
          if (e.key === 'Escape') {
            setIsAdding(false);
            setTitle('');
          }
        }}
        placeholder="Enter list title..."
        className="w-full px-3 py-2 text-sm bg-white rounded border-2 border-trello-blue focus:outline-none mb-2"
        autoFocus
      />
      <div className="flex items-center gap-2">
        <button onClick={handleCreate} className="btn btn-primary text-sm">
          Add List
        </button>
        <button
          onClick={() => {
            setIsAdding(false);
            setTitle('');
          }}
          className="p-1 hover:bg-trello-gray-200 rounded"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
