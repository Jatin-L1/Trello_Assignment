'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, CheckSquare, MessageSquare, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import CardModal from './CardModal';

interface CardProps {
  card: {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    cover_image?: string;
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
        className={`bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
          isSortableDragging ? 'opacity-50' : ''
        }`}
      >
        {card.cover_image && (
          <div
            className="h-32 bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${card.cover_image})` }}
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
