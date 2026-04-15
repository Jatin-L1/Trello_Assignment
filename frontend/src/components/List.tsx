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
      className="w-72 flex-shrink-0 flex flex-col max-h-full"
    >
      <div 
        className={`rounded-lg flex flex-col max-h-full shadow-sm ${list.color ? '' : 'bg-trello-gray-100'}`}
        style={list.color ? { backgroundColor: list.color } : {}}
      >
        
        {/* List Header */}
        <div className="p-2 flex items-center justify-between" {...attributes} {...listeners}>
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
              className="flex-1 px-2 py-1 text-sm font-semibold bg-white rounded border-2 border-trello-blue focus:outline-none"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditingTitle(true)}
              className={`flex-1 px-2 py-1 text-sm font-semibold cursor-pointer rounded ${
                list.color ? 'text-white hover:bg-white/20' : 'text-trello-gray-900 hover:bg-trello-gray-200'
              }`}
            >
              {list.title}
            </h3>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-1 rounded transition-colors ${
                list.color ? 'text-white hover:bg-white/20' : 'text-trello-gray-700 hover:bg-trello-gray-200'
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-10 w-64 bg-white rounded-lg shadow-modal z-[100] py-2 border">
                  
                  <div className="px-3 pb-3 border-b">
                    <h4 className="text-xs font-semibold text-trello-gray-600 uppercase mb-3 text-center">List Color</h4>
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {LIST_COLORS.map(color => (
                        <div
                          key={color}
                          onClick={() => handleUpdateColor(color)}
                          className="h-8 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                          style={{ backgroundColor: color }}
                        >
                          {list.color === color && <Check className="w-4 h-4 text-white" />}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleRemoveColor}
                      className="w-full py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      Remove color
                    </button>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={handleDeleteList}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-trello-gray-100 text-red-600 font-medium"
                    >
                      Delete List
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          <SortableContext
            items={filteredCards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredCards.map((card) => (
              <Card key={card.id} card={card} listId={list.id} />
            ))}
          </SortableContext>

          {/* Add Card Form */}
          {isAddingCard && (
            <div className="space-y-2">
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
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border-2 border-trello-blue focus:outline-none resize-none"
                rows={3}
                autoFocus
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCard}
                  className="btn btn-primary text-sm"
                >
                  Add Card
                </button>
                <button
                  onClick={() => {
                    setIsAddingCard(false);
                    setCardTitle('');
                  }}
                  className={`p-1 rounded transition-colors ${
                    list.color ? 'text-white hover:bg-white/20' : 'hover:bg-trello-gray-200'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Card Button */}
        {!isAddingCard && (
          <button
            onClick={() => setIsAddingCard(true)}
            className={`mx-2 mb-2 px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
              list.color ? 'text-white hover:bg-white/20' : 'text-trello-gray-700 hover:bg-trello-gray-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}
