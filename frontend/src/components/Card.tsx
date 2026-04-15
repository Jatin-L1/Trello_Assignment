'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, CheckSquare, MessageSquare, Paperclip, MoreHorizontal, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import CardModal from './CardModal';
import { api } from '@/services/api';
import { useBoardStore } from '@/store/boardStore';

const COVER_COLORS = [
  '#216E4E', '#7F5F01', '#A54800', '#AE2E24', '#5E4DB2',
  '#0055CC', '#206A83', '#4C9B62', '#943D73', '#596773'
];

interface CardProps {
  card: {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    coverImage?: string;
    labels?: any[];
    members?: any[];
    checklists?: any[];
    comments?: any[];
    attachments?: any[];
  };
  listId?: string;
  isDragging?: boolean;
}

export default function Card({ card, listId, isDragging = false }: CardProps) {
  const [showModal, setShowModal] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const { currentBoard, fetchBoard } = useBoardStore();

  const handleUpdateColor = async (e: React.MouseEvent, colorHex: string) => {
    e.stopPropagation();
    try {
      await api.updateCard(card.id, { cover_image: colorHex });
      setShowColorMenu(false);
      if (currentBoard) {
        fetchBoard(currentBoard.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveColor = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.updateCard(card.id, { cover_image: null });
      setShowColorMenu(false);
      if (currentBoard) {
        fetchBoard(currentBoard.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      listId,
    },
    disabled: isDragging,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Calculate checklist progress
  const checklistStats = card.checklists?.reduce(
    (acc, checklist) => {
      const total = checklist.items?.length || 0;
      const completed = checklist.items?.filter((item: any) => item.is_completed).length || 0;
      return {
        total: acc.total + total,
        completed: acc.completed + completed,
      };
    },
    { total: 0, completed: 0 }
  );

  const isDueSoon = card.due_date && new Date(card.due_date) < new Date(Date.now() + 24 * 60 * 60 * 1000);
  const isOverdue = card.due_date && new Date(card.due_date) < new Date();

  if (isDragging) {
    return (
      <div className="bg-white rounded-lg p-3 shadow-card-hover rotate-3 cursor-grabbing">
        <div className="font-medium text-sm text-trello-gray-900">{card.title}</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => setShowModal(true)}
        className={`relative group bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
          isSortableDragging ? 'opacity-50' : ''
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorMenu(!showColorMenu);
          }}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1.5 bg-white/90 hover:bg-trello-gray-200 text-trello-gray-700 rounded transition-opacity z-10"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showColorMenu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20">
            <div 
              className="w-64 bg-white rounded-lg shadow-xl p-3 border relative"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-semibold text-trello-gray-600 uppercase">Colors</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowColorMenu(false); }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {COVER_COLORS.map(color => (
                  <div
                    key={color}
                    onClick={(e) => handleUpdateColor(e, color)}
                    className="h-8 rounded cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    {card.coverImage === color && <Check className="w-4 h-4 text-white" />}
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
          </div>
        )}

        {card.coverImage && (
          <div
            className="h-8 bg-cover bg-center rounded-t-lg"
            style={
              card.coverImage.startsWith('#') 
                ? { backgroundColor: card.coverImage }
                : { backgroundImage: `url(${card.coverImage})`, height: '8rem' }
            }
          />
        )}
        
        <div className="p-3 space-y-2">
          {/* Labels */}
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.labels.map((label) => (
                <div
                  key={label.id}
                  className="h-2 w-10 rounded-full"
                  style={{ backgroundColor: label.color }}
                  title={label.name}
                />
              ))}
            </div>
          )}

          {/* Title */}
          <div className="font-medium text-sm text-trello-gray-900 leading-tight">
            {card.title}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-trello-gray-700">
            {card.due_date && (
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                  isOverdue
                    ? 'bg-red-100 text-red-700'
                    : isDueSoon
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-trello-gray-100'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(card.due_date), 'MMM d')}</span>
              </div>
            )}

            {checklistStats && checklistStats.total > 0 && (
              <div
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
                  checklistStats.completed === checklistStats.total
                    ? 'bg-green-100 text-green-700'
                    : 'bg-trello-gray-100'
                }`}
              >
                <CheckSquare className="w-3 h-3" />
                <span>
                  {checklistStats.completed}/{checklistStats.total}
                </span>
              </div>
            )}

            {card.description && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
              </div>
            )}

            {card.comments && card.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{card.comments.length}</span>
              </div>
            )}

            {card.attachments && card.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                <span>{card.attachments.length}</span>
              </div>
            )}
          </div>

          {/* Members */}
          {card.members && card.members.length > 0 && (
            <div className="flex -space-x-1">
              {card.members.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  title={member.full_name}
                >
                  {member.full_name?.charAt(0).toUpperCase()}
                </div>
              ))}
              {card.members.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-trello-gray-300 border-2 border-white flex items-center justify-center text-trello-gray-700 text-xs font-medium">
                  +{card.members.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CardModal
          cardId={card.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
