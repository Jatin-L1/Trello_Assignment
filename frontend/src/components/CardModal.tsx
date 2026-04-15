'use client';

import { useEffect, useState } from 'react';
import { X, CreditCard, AlignLeft, CheckSquare, Calendar, Tag, User, Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import { useBoardStore } from '@/store/boardStore';
import { format } from 'date-fns';

interface CardModalProps {
  cardId: string;
  onClose: () => void;
}

export default function CardModal({ cardId, onClose }: CardModalProps) {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [showAddChecklist, setShowAddChecklist] = useState(false);

  const { updateCard, deleteCard, currentBoard } = useBoardStore();

  useEffect(() => {
    loadCard();
  }, [cardId]);

  const loadCard = async () => {
    try {
      const response = await api.getCard(cardId);
      setCard(response.data);
      setTitle(response.data.title);
      setDescription(response.data.description || '');
      setLoading(false);
    } catch (error) {
      console.error('Failed to load card:', error);
      setLoading(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (title.trim() && title !== card.title) {
      await updateCard(cardId, { title: title.trim() });
      setCard({ ...card, title: title.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleUpdateDescription = async () => {
    await updateCard(cardId, { description: description.trim() });
    setCard({ ...card, description: description.trim() });
    setIsEditingDescription(false);
  };

  const handleDeleteCard = async () => {
    if (confirm('Are you sure you want to delete this card?')) {
      await deleteCard(cardId);
      onClose();
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      await api.createComment({
        card_id: cardId,
        user_id: '11111111-1111-1111-1111-111111111111',
        content: newComment.trim(),
      });
      setNewComment('');
      loadCard();
    }
  };

  const handleToggleChecklistItem = async (itemId: string, isCompleted: boolean) => {
    await api.updateChecklistItem(itemId, { is_completed: !isCompleted });
    loadCard();
  };

  const handleAddChecklist = async () => {
    if (newChecklistTitle.trim()) {
      await api.createChecklist({
        card_id: cardId,
        title: newChecklistTitle.trim(),
      });
      setNewChecklistTitle('');
      setShowAddChecklist(false);
      loadCard();
    }
  };

  const handleAddChecklistItem = async (checklistId: string, title: string) => {
    if (title.trim()) {
      await api.createChecklistItem({
        checklist_id: checklistId,
        title: title.trim(),
      });
      loadCard();
    }
  };

  const handleToggleLabel = async (labelId: string) => {
    const hasLabel = card.labels.some((l: any) => l.id === labelId);
    if (hasLabel) {
      await api.removeLabelFromCard(cardId, labelId);
    } else {
      await api.addLabelToCard({ card_id: cardId, label_id: labelId });
    }
    loadCard();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4">
      <div className="bg-trello-gray-50 rounded-lg shadow-modal w-full max-w-3xl my-8">
        {/* Cover Image */}
        {card.cover_image && (
          <div
            className="h-32 bg-cover bg-center rounded-t-lg"
            style={{ backgroundImage: `url(${card.cover_image})` }}
          />
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-trello-gray-700 mt-1" />
            <div className="flex-1">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleUpdateTitle}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                  className="w-full text-xl font-semibold px-2 py-1 border-2 border-trello-blue rounded focus:outline-none"
                  autoFocus
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-semibold text-trello-gray-900 cursor-pointer hover:bg-trello-gray-200 px-2 py-1 rounded"
                >
                  {card.title}
                </h2>
              )}
              <p className="text-sm text-trello-gray-600 mt-1">
                in list <span className="font-medium">{card.list_title}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-trello-gray-200 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Labels */}
              {card.labels && card.labels.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-trello-gray-700" />
                    <h3 className="text-sm font-semibold text-trello-gray-900">Labels</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.labels.map((label: any) => (
                      <div
                        key={label.id}
                        className="px-3 py-1 rounded text-white text-sm font-medium"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name || 'Label'}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlignLeft className="w-5 h-5 text-trello-gray-700" />
                  <h3 className="text-sm font-semibold text-trello-gray-900">Description</h3>
                </div>
                {isEditingDescription ? (
                  <div className="space-y-2">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-trello-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-trello-blue resize-none"
                      rows={5}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button onClick={handleUpdateDescription} className="btn btn-primary">
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setDescription(card.description || '');
                          setIsEditingDescription(false);
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditingDescription(true)}
                    className="px-3 py-2 bg-trello-gray-200 hover:bg-trello-gray-300 rounded cursor-pointer min-h-[60px] text-sm text-trello-gray-900"
                  >
                    {card.description || 'Add a more detailed description...'}
                  </div>
                )}
              </div>

              {/* Checklists */}
              {card.checklists && card.checklists.length > 0 && (
                <div className="space-y-4">
                  {card.checklists.map((checklist: any) => {
                    const completed = checklist.items?.filter((i: any) => i.is_completed).length || 0;
                    const total = checklist.items?.length || 0;
                    const progress = total > 0 ? (completed / total) * 100 : 0;

                    return (
                      <div key={checklist.id}>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckSquare className="w-5 h-5 text-trello-gray-700" />
                          <h3 className="text-sm font-semibold text-trello-gray-900">{checklist.title}</h3>
                        </div>
                        
                        {total > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-trello-gray-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-trello-gray-300 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  progress === 100 ? 'bg-green-500' : 'bg-trello-blue'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          {checklist.items?.map((item: any) => (
                            <label
                              key={item.id}
                              className="flex items-start gap-2 p-2 hover:bg-trello-gray-200 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={item.is_completed}
                                onChange={() => handleToggleChecklistItem(item.id, item.is_completed)}
                                className="mt-1 w-4 h-4 text-trello-blue rounded focus:ring-trello-blue"
                              />
                              <span
                                className={`text-sm ${
                                  item.is_completed ? 'line-through text-trello-gray-600' : 'text-trello-gray-900'
                                }`}
                              >
                                {item.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Comments */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlignLeft className="w-5 h-5 text-trello-gray-700" />
                  <h3 className="text-sm font-semibold text-trello-gray-900">Activity</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      J
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 border border-trello-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-trello-blue resize-none text-sm"
                        rows={3}
                      />
                      {newComment && (
                        <button onClick={handleAddComment} className="btn btn-primary mt-2">
                          Save
                        </button>
                      )}
                    </div>
                  </div>

                  {card.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {comment.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.full_name}</span>
                          <span className="text-xs text-trello-gray-600">
                            {format(new Date(comment.created_at), 'MMM d \'at\' h:mm a')}
                          </span>
                        </div>
                        <div className="bg-white px-3 py-2 rounded text-sm text-trello-gray-900">
                          {comment.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-40 space-y-2">
              <h4 className="text-xs font-semibold text-trello-gray-600 uppercase mb-2">Add to card</h4>
              
              <button className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                Members
              </button>
              
              <button className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4" />
                Labels
              </button>
              
              {showAddChecklist ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newChecklistTitle}
                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                    placeholder="Checklist title"
                    className="w-full input text-sm"
                    autoFocus
                  />
                  <button onClick={handleAddChecklist} className="btn btn-primary w-full text-sm">
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddChecklist(true)}
                  className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm"
                >
                  <CheckSquare className="w-4 h-4" />
                  Checklist
                </button>
              )}
              
              <button className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                Dates
              </button>

              <h4 className="text-xs font-semibold text-trello-gray-600 uppercase mb-2 mt-4">Actions</h4>
              
              <button
                onClick={handleDeleteCard}
                className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
