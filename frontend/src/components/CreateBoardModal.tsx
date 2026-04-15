'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useRouter } from 'next/navigation';

interface CreateBoardModalProps {
  onClose: () => void;
}

const BACKGROUND_COLORS = [
  '#0079bf', '#d29034', '#519839', '#b04632', '#89609e',
  '#cd5a91', '#4bbf6b', '#00aecc', '#838c91'
];

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1620803517453-2943e8bb8ba1?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1506744626753-1fa44df318dc?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1920'
];

export default function CreateBoardModal({ onClose }: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#0079bf');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const { createBoard } = useBoardStore();
  const router = useRouter();

  const handleCreate = async () => {
    if (title.trim()) {
      const response = await createBoard({
        title: title.trim(),
        background_color: backgroundColor,
        background_image: backgroundImage,
        created_by: '11111111-1111-1111-1111-111111111111',
      });
      onClose();
      // Navigate to the new board
      if (response) {
        router.push(`/board/${response.data.id}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-trello-gray-900">Create Board</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-trello-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Preview */}
            <div
              className="h-32 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
                backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
              <span className="text-white font-semibold text-lg relative z-10">
                {title || 'Board Title'}
              </span>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-trello-gray-700 mb-1">
                Board Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Enter board title..."
                className="input"
                autoFocus
              />
            </div>

            {/* Background Selection */}
            <div>
              <label className="block text-sm font-medium text-trello-gray-700 mb-2">
                Background
              </label>
              
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Colors</div>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setBackgroundColor(color);
                      setBackgroundImage(null);
                    }}
                    className={`h-12 rounded-lg transition-all ${
                      backgroundColor === color && !backgroundImage
                        ? 'ring-2 ring-trello-blue ring-offset-2'
                        : 'hover:opacity-80'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Photos</div>
              <div className="grid grid-cols-4 gap-2">
                {BACKGROUND_IMAGES.map((img) => (
                  <button
                    key={img}
                    onClick={() => {
                      setBackgroundImage(img);
                      setBackgroundColor('#000000');
                    }}
                    className={`h-12 rounded-lg transition-all bg-cover bg-center ${
                      backgroundImage === img
                        ? 'ring-2 ring-trello-blue ring-offset-2'
                        : 'hover:opacity-80'
                    }`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreate}
                disabled={!title.trim()}
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Board
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
