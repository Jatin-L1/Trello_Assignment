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
      <div className="bg-[#22272b] rounded-[8px] p-3 shadow-sm rotate-3 cursor-grabbing">
        <div className="font-[400] text-[14px] text-[#b6c2cf]">{card.title}</div>
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
        onClick={(e) => {
          // ensure dragging doesn't trigger modal
          if (isDragging) return;
          setShowModal(true);
        }}
        className={`relative group bg-[#22272b] rounded-[8px] shadow-[0_1px_1px_rgba(9,30,66,0.25),0_0_1px_rgba(9,30,66,0.31)] cursor-pointer overflow-hidden ${
          isSortableDragging ? 'opacity-50' : 'hover:outline hover:outline-2 hover:outline-[#85b8ff] hover:outline-offset-0'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorMenu(!showColorMenu);
          }}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-[4px] bg-[#22272b]/90 hover:bg-[#a6c5e229] text-[#9fadbc] rounded-[4px] transition-colors z-10"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showColorMenu && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20">
            <div 
              className="w-64 bg-[#282e33] rounded-[3px] shadow-[0_8px_16px_-4px_rgba(9,30,66,0.25),0_0_0_1px_rgba(9,30,66,0.08)] p-3 relative text-[#b6c2cf]"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center items-center mb-3 relative">
                <h4 className="text-[12px] font-[600] text-[#9fadbc] uppercase">Colors</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowColorMenu(false); }}
                  className="absolute right-0 text-[#9fadbc] hover:bg-[#a6c5e229] p-1 rounded-[3px] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-3">
                {COVER_COLORS.map(color => (
                  <div
                    key={color}
                    onClick={(e) => handleUpdateColor(e, color)}
                    className="h-8 rounded-[3px] cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center relative group"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 rounded-[3px]" />
                    {card.coverImage === color && <Check className="w-4 h-4 text-white z-10 relative" />}
                  </div>
                ))}
              </div>
              <button
                onClick={handleRemoveColor}
                className="w-full py-[6px] text-[14px] font-[500] text-[#b6c2cf] bg-[#a6c5e229] hover:bg-[#a6c5e229]/80 rounded-[3px] transition-colors"
              >
                Remove color
              </button>
            </div>
          </div>
        )}

        {card.coverImage && (
          <div
            className="w-full bg-cover bg-center"
            style={
              card.coverImage.startsWith('#') 
                ? { backgroundColor: card.coverImage, height: '32px' }
                : { backgroundImage: `url(${card.coverImage})`, height: '160px' }
            }
          />
        )}
        
        <div className="px-3 pt-2 pb-2 space-y-1 block">
          {/* Labels */}
          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
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
          <div className="font-[400] text-[14px] text-[#b6c2cf] leading-[20px] break-words">
            {card.title}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-[12px] text-[12px] text-[#9fadbc] pt-1">
            {card.due_date && (
              <div
                className={`flex items-center gap-[4px] px-1 rounded-[3px] ${
                  isOverdue
                    ? 'bg-red-900 text-white'
                    : isDueSoon
                    ? 'bg-yellow-900 text-white'
                    : 'hover:bg-[#a6c5e229]'
                }`}
              >
                <Calendar className="w-[14px] h-[14px]" />
                <span>{format(new Date(card.due_date), 'MMM d')}</span>
              </div>
            )}

            {card.description && (
              <div className="flex items-center hover:bg-[#a6c5e229] px-1 rounded-[3px]" title="This card has a description.">
                <div className="w-[16px] h-[16px] flex items-center justify-center">
                  <svg width="16" height="16" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1h-16v-1zm16 3H4v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-13zm-9 3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-4z" fill="currentColor"></path></svg>
                </div>
              </div>
            )}
            
            {card.attachments && card.attachments.length > 0 && (
              <div className="flex items-center gap-[4px] hover:bg-[#a6c5e229] px-1 rounded-[3px]" title="Attachments">
                <Paperclip className="w-[14px] h-[14px] transform -rotate-45" />
                <span>{card.attachments.length}</span>
              </div>
            )}

            {checklistStats && checklistStats.total > 0 && (
              <div
                className={`flex items-center gap-[4px] px-[4px] rounded-[3px] ${
                  checklistStats.completed === checklistStats.total
                    ? 'bg-[#1f845a] text-white hover:bg-[#1f845a]/80'
                    : 'hover:bg-[#a6c5e229]'
                }`}
                title="Checklist items"
              >
                <CheckSquare className="w-[14px] h-[14px]" />
                <span>
                  {checklistStats.completed}/{checklistStats.total}
                </span>
              </div>
            )}

            {card.comments && card.comments.length > 0 && (
              <div className="flex items-center gap-[4px] hover:bg-[#a6c5e229] px-1 rounded-[3px]" title="Comments">
                <MessageSquare className="w-[14px] h-[14px]" />
                <span>{card.comments.length}</span>
              </div>
            )}
          </div>

          {/* Members */}
          {card.members && card.members.length > 0 && (
            <div className="flex -space-x-1 pt-1 justify-end w-full">
              {card.members.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="w-6 h-6 rounded-full bg-[#1c2b41] border border-[#22272b] flex items-center justify-center text-white text-[12px] font-medium"
                  title={member.full_name}
                >
                  {member.full_name?.charAt(0).toUpperCase()}
                </div>
              ))}
              {card.members.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-[#a6c5e229] border border-[#22272b] flex items-center justify-center text-[#9fadbc] text-[12px] font-medium">
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
