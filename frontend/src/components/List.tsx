'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import Card from './Card';
import { useBoardStore } from '@/store/boardStore';

interface ListProps {
  list: {
    id: string;
    title: string;
    cards: any[];
  };
}

export default function List({ list }: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);
  
  const { createCard, updateList, deleteList } = useBoardStore();

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-72 flex-shrink-0 flex flex-col max-h-full"
    >
      <div className="bg-trello-gray-100 rounded-lg flex flex-col max-h-full shadow-sm">
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
              className="flex-1 px-2 py-1 text-sm font-semibold text-trello-gray-900 cursor-pointer hover:bg-trello-gray-200 rounded"
            >
              {list.title}
            </h3>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-trello-gray-200 rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-trello-gray-700" />
            </button>
            
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-modal z-20 py-2">
                  <button
                    onClick={handleDeleteList}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-trello-gray-100 text-red-600"
                  >
                    Delete List
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          <SortableContext
            items={list.cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {list.cards.map((card) => (
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
                  className="p-1 hover:bg-trello-gray-200 rounded"
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
            className="mx-2 mb-2 px-3 py-2 text-sm text-trello-gray-700 hover:bg-trello-gray-200 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}
