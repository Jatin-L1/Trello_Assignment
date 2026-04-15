'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus, X, Check } from 'lucide-react';
import Card from './Card';
import { useBoardStore } from '@/store/boardStore';

const LIST_COLORS = [
  '#f87168', '#4bce97', '#579dff', '#8590a2', '#e2b203',
  '#8f7ee7', '#00b8d9', '#ff991f', '#ff7452', '#86abce'
];

interface ListProps {
  list: {
    id: string;
    title: string;
    color?: string;
    cards: any[];
  };
}

export default function List({ list }: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);
  
  const { createCard, updateList, deleteList, searchQuery, filterMembers, filterLabels, filterDueDate } = useBoardStore();

  const filteredCards = list.cards.filter((c: any) => {
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterMembers.length > 0 && !c.members?.some((m: any) => filterMembers.includes(m.id))) return false;
    if (filterLabels.length > 0 && !c.labels?.some((l: any) => filterLabels.includes(l.id))) return false;
    if (filterDueDate && !c.dueDate && !c.due_date) return false;
    return true;
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAddCard = async () => {
    if (cardTitle.trim()) {
      await createCard(list.id, cardTitle.trim());
      setCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (listTitle.trim() && listTitle !== list.title) {
      await updateList(list.id, listTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleDeleteList = async () => {
    if (confirm('Are you sure you want to delete this list?')) {
      await deleteList(list.id);
    }
    setShowMenu(false);
  };

  const handleUpdateColor = async (color: string) => {
    await updateList(list.id, { color });
    setShowMenu(false);
  };

  const handleRemoveColor = async () => {
    await updateList(list.id, { color: null });
    setShowMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[272px] flex-shrink-0 flex flex-col max-h-[100%]"
    >
      <div 
        className={`rounded-[12px] flex flex-col max-h-full shadow-[0_1px_1px_rgba(9,30,66,0.25)] ${list.color ? '' : 'bg-[#101204]'}`}
        style={list.color ? { backgroundColor: list.color } : {}}
      >
        
        {/* List Header */}
        <div className="px-3 pt-[10px] pb-2 flex items-center justify-between group/header cursor-pointer" {...attributes} {...listeners}>
          {isEditingTitle ? (
            <input
              type="text"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTitle();
                if (e.key === 'Escape') {
                  setListTitle(list.title);
                  setIsEditingTitle(false);
                }
              }}
              className="flex-1 px-2 py-1 text-[14px] font-[600] bg-[#22272b] text-[#b6c2cf] rounded-[3px] border-2 border-[#579dff] focus:outline-none h-[28px] leading-[20px]"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className={`flex-1 px-2 py-1 text-[14px] font-[600] leading-[20px] rounded-[3px] ${
                list.color ? 'text-[#1d2125] hover:bg-black/10' : 'text-[#b6c2cf]'
              }`}
            >
              {list.title}
            </h3>
          )}
          
          <div className="relative flex items-center gap-[4px]">
            <button
              onClick={(e) => {
                 e.stopPropagation();
                 setShowMenu(!showMenu);
              }}
              className={`p-[6px] rounded-[3px] transition-colors ${
                list.color ? 'text-[#1d2125] hover:bg-black/10' : 'text-[#9fadbc] hover:bg-[#a6c5e229]'
              }`}
            >
              <MoreHorizontal className="w-[16px] h-[16px]" />
            </button>
            
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-10 w-[304px] bg-[#282e33] text-[#b6c2cf] rounded-[3px] shadow-[0_8px_16px_-4px_rgba(9,30,66,0.25),0_0_0_1px_rgba(9,30,66,0.08)] z-[100] py-3 cursor-default">
                  <div className="flex items-center justify-center mb-3 relative px-3">
                    <h4 className="text-[14px] font-[600] text-[#9fadbc]">List actions</h4>
                    <button 
                      onClick={() => setShowMenu(false)}
                      className="absolute right-3 text-[#9fadbc] hover:bg-[#a6c5e229] p-1.5 rounded-[3px] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="px-3 mb-2">
                    <div className="text-[12px] font-[600] text-[#9fadbc] uppercase mb-2">Colors</div>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {LIST_COLORS.map(color => (
                        <div
                          key={color}
                          onClick={() => handleUpdateColor(color)}
                          className="h-8 rounded-[3px] cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center relative group"
                          style={{ backgroundColor: color }}
                        >
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 rounded-[3px]" />
                          {list.color === color && <Check className="w-4 h-4 text-white z-10 relative" />}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleRemoveColor}
                      className="w-full py-[6px] text-[14px] font-[500] text-[#b6c2cf] hover:bg-[#a6c5e229] rounded-[3px] transition-colors text-left px-3"
                    >
                      Remove color
                    </button>
                  </div>
                  
                  <hr className="border-[#38414a] my-2" />
                  <button
                    onClick={handleDeleteList}
                    className="w-full px-3 py-[6px] text-left text-[14px] text-[#b6c2cf] hover:bg-[#a6c5e229] transition-colors"
                  >
                    Archive this list
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto px-[6px] overflow-x-hidden min-h-0 container-scrollbar">
          <div className="flex flex-col gap-[8px] pb-2 pt-[2px]">
            <SortableContext
              items={filteredCards.map((c: any) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredCards.map((card: any) => (
                <Card key={card.id} card={card} listId={list.id} />
              ))}
            </SortableContext>
          </div>
        </div>

        {/* List Footer */}
        <div className="p-2 pt-0">
          {isAddingCard ? (
            <div className="flex flex-col gap-2 pt-2">
              <textarea
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCard();
                  }
                  if (e.key === 'Escape') {
                    setIsAddingCard(false);
                    setCardTitle('');
                  }
                }}
                placeholder="Enter a title for this card..."
                className="w-full p-2 text-[14px] text-[#b6c2cf] bg-[#22272b] rounded-[8px] shadow-[0_1px_1px_rgba(9,30,66,0.25),0_0_1px_rgba(9,30,66,0.31)] resize-none focus:outline-none focus:outline-[#85b8ff] focus:outline-offset-0 min-h-[64px]"
                rows={3}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCard}
                  className="bg-[#579dff] text-[#1d2125] font-[500] text-[14px] px-3 py-[6px] rounded-[3px] hover:bg-[#85b8ff] transition-colors leading-[20px]"
                >
                  Add card
                </button>
                <button
                  onClick={() => {
                    setIsAddingCard(false);
                    setCardTitle('');
                  }}
                  className={`p-1 rounded-[3px] transition-colors ${
                    list.color ? 'text-[#1d2125] hover:bg-black/10' : 'text-[#9fadbc] hover:bg-[#a6c5e229]'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between cursor-pointer group hover:bg-[#a6c5e229] rounded-[8px] px-2 py-[6px] transition-colors mt-1">
              <button
                onClick={() => setIsAddingCard(true)}
                className={`flex-1 flex items-center gap-[6px] text-[14px] font-[500] ${
                  list.color ? 'text-[#1d2125]/80 hover:text-[#1d2125]' : 'text-[#9fadbc] hover:text-[#b6c2cf]'
                }`}
              >
                <Plus className="w-[16px] h-[16px]" />
                Add a card
              </button>
              <button className={`opacity-0 group-hover:opacity-100 p-1 rounded-[3px] transition-colors ${
                  list.color ? 'text-[#1d2125]/80 hover:text-[#1d2125] hover:bg-black/10' : 'text-[#9fadbc] hover:text-[#b6c2cf] hover:bg-[#a6c5e229]'
                }`}>
                <div title="Create from template">
                   <svg width="16" height="16" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 18V6h14v12H5zm2-10h6v6H7V8zm8 0h2v2h-2V8zm0 4h2v2h-2v-2z" fill="currentColor"></path></svg>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
