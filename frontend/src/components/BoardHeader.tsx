'use client';

import { useState } from 'react';
import { Star, Users, Filter, Palette, Image as ImageIcon } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';

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

interface BoardHeaderProps {
  board: {
    id: string;
    title: string;
    isStarred?: boolean;
    members?: any[];
  };
}

export default function BoardHeader({ board }: BoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(false);
  
  const { 
    updateBoard,
    uploadBoardBackground,
    filterMembers, setFilterMembers, 
    filterLabels, setFilterLabels, 
    filterDueDate, setFilterDueDate,
    currentBoard
  } = useBoardStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsBgPickerOpen(false);
      await uploadBoardBackground(board.id, file);
    }
  };

  const handleSave = async () => {
    if (title.trim() && title !== board.title) {
      await updateBoard(board.id, { title: title.trim() });
    }
    setIsEditing(false);
  };

  const toggleStar = async () => {
    await updateBoard(board.id, { is_starred: !board.isStarred });
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
            board.isStarred
              ? 'text-yellow-400 hover:bg-white/10'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Star className={`w-5 h-5 ${board.isStarred ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 relative">
        <button 
          onClick={() => { setIsBgPickerOpen(!isBgPickerOpen); setIsFilterOpen(false); }}
          className={`flex items-center gap-2 ${isBgPickerOpen ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'} text-white px-3 py-1.5 rounded transition-colors`}
        >
          <Palette className="w-4 h-4" />
          <span className="text-sm font-medium">Background</span>
        </button>

        {isBgPickerOpen && (
          <div className="absolute top-10 right-0 w-72 bg-white rounded shadow-xl z-50 text-trello-gray-900 p-3 flex flex-col gap-3">
            <div>
              <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {BACKGROUND_COLORS.map(color => (
                  <div
                    key={color}
                    onClick={() => {
                      updateBoard(board.id, { background_color: color, background_image: null });
                      setIsBgPickerOpen(false);
                    }}
                    className="w-10 h-8 rounded cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Photos</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {BACKGROUND_IMAGES.map(img => (
                  <div
                    key={img}
                    onClick={() => {
                      updateBoard(board.id, { background_color: '#000000', background_image: img });
                      setIsBgPickerOpen(false);
                    }}
                    className="h-16 rounded cursor-pointer bg-cover bg-center hover:opacity-80 transition-opacity"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
              <label className="flex items-center justify-center gap-2 w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4" />
                Upload Photo
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/gif,image/webp" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        )}

        <button 
          onClick={() => { setIsFilterOpen(!isFilterOpen); setIsBgPickerOpen(false); }}
          className={`flex items-center gap-2 ${isFilterOpen ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'} text-white px-3 py-1.5 rounded transition-colors`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>

        {isFilterOpen && (
          <div className="absolute top-10 right-0 w-64 bg-white rounded shadow-xl z-50 text-trello-gray-900 text-sm overflow-hidden p-2">
            <h3 className="font-semibold px-2 py-1 mb-1 border-b">Due Date</h3>
            <label className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded">
              <input 
                type="checkbox" 
                checked={filterDueDate} 
                onChange={(e) => setFilterDueDate(e.target.checked)} 
              />
              Has Due Date
            </label>

            {currentBoard?.labels && currentBoard.labels.length > 0 && (
              <>
                <h3 className="font-semibold px-2 py-1 mt-2 mb-1 border-b">Labels</h3>
                <div className="max-h-32 overflow-y-auto">
                  {currentBoard.labels.map((label: any) => (
                    <label key={label.id} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded">
                      <input 
                        type="checkbox" 
                        checked={filterLabels.includes(label.id)} 
                        onChange={(e) => {
                          if (e.target.checked) setFilterLabels([...filterLabels, label.id]);
                          else setFilterLabels(filterLabels.filter(id => id !== label.id));
                        }} 
                      />
                      <span className="w-4 h-4 rounded" style={{ backgroundColor: label.color }}></span>
                      {label.name || 'Unnamed Label'}
                    </label>
                  ))}
                </div>
              </>
            )}

            {currentBoard?.members && currentBoard.members.length > 0 && (
              <>
                <h3 className="font-semibold px-2 py-1 mt-2 mb-1 border-b">Members</h3>
                <div className="max-h-32 overflow-y-auto">
                  {currentBoard.members.map((member: any) => (
                    <label key={member.id} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded">
                      <input 
                        type="checkbox" 
                        checked={filterMembers.includes(member.id)} 
                        onChange={(e) => {
                          if (e.target.checked) setFilterMembers([...filterMembers, member.id]);
                          else setFilterMembers(filterMembers.filter(id => id !== member.id));
                        }} 
                      />
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                        {member.full_name?.charAt(0).toUpperCase()}
                      </div>
                      {member.full_name}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
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
