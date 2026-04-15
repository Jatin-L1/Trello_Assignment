'use client';

import { useEffect, useState } from 'react';
import { X, CreditCard, AlignLeft, CheckSquare, Calendar, Tag, User, Trash2, Image, Paperclip } from 'lucide-react';
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
  const [newItemTitles, setNewItemTitles] = useState<Record<string, string>>({});
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showDates, setShowDates] = useState(false);

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

  const handleToggleMember = async (memberId: string) => {
    const hasMember = card.members?.some((m: any) => m.id === memberId);
    if (hasMember) {
      await api.removeMemberFromCard(cardId, memberId);
    } else {
      await api.addMemberToCard({ card_id: cardId, user_id: memberId });
    }
    loadCard();
  };

  const handleUpdateDate = async (date: string) => {
    await updateCard(cardId, { due_date: date });
    setShowDates(false);
    loadCard();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      await api.uploadAttachment(cardId, file);
      const res = await api.getCard(cardId);
      setCard(res.data);
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const handleSetCover = async (imageUrl: string) => {
    try {
      await api.updateCard(cardId, { cover_image: imageUrl });
      const res = await api.getCard(cardId);
      setCard(res.data);
    } catch (error) {
      console.error('Failed to update cover:', error);
    }
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto p-4 transition-opacity">
      <div className="bg-trello-gray-50 rounded-lg shadow-modal w-full max-w-3xl my-8 relative overflow-hidden flex flex-col">
        
        {/* Cover Image */}
        {card.coverImage && (
          <div 
            className="h-40 relative group" 
            style={
              card.coverImage.startsWith('#')
                ? { backgroundColor: card.coverImage }
                : { backgroundImage: `url(${card.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            }
          >
            <button 
              onClick={() => handleSetCover("")}
              className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 text-sm rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            >
              <X className="w-4 h-4"/> Remove cover
            </button>
          </div>
        )}
        
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${card.coverImage ? 'hover:bg-trello-gray-200 text-trello-gray-600' : 'text-trello-gray-600 hover:bg-trello-gray-200 bg-transparent'}`}
          >
            <X className="w-5 h-5" />
          </button>

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

          <div className="flex flex-col md:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Properties (Members, Labels, Dates) */}
              <div className="flex flex-wrap gap-4">
                {card.members && card.members.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-trello-gray-600 mb-1">Members</h3>
                    <div className="flex flex-wrap gap-1">
                      {card.members.map((member: any) => (
                        <div
                          key={member.id}
                          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
                          title={member.full_name}
                        >
                          {member.full_name?.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {card.labels && card.labels.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-trello-gray-600 mb-1">Labels</h3>
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

                {card.due_date && (
                  <div>
                    <h3 className="text-xs font-semibold text-trello-gray-600 mb-1">Due Date</h3>
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded">
                      <input 
                        type="checkbox" 
                        title="Mark as complete" 
                        className="w-4 h-4 rounded text-blue-500" 
                      />
                      <span className="text-sm text-gray-800">
                        {format(new Date(card.due_date), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  </div>
                )}
              </div>

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
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="w-5 h-5 text-trello-gray-700" />
                            <h3 className="text-sm font-semibold text-trello-gray-900">{checklist.title}</h3>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                await api.deleteChecklist(checklist.id);
                                loadCard();
                              } catch (err) { console.error(err); }
                            }}
                            className="px-2 py-1 text-xs bg-trello-gray-200 hover:bg-trello-gray-300 text-trello-gray-800 rounded"
                          >
                            Delete
                          </button>
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

                        <div className="space-y-2 mt-2">
                          {checklist.items?.map((item: any) => (
                            <div key={item.id} className="group flex items-start justify-between hover:bg-trello-gray-200 p-2 rounded relative">
                              <label className="flex items-start gap-2 cursor-pointer w-full">
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
                              <button
                               onClick={async () => {
                                 await api.deleteChecklistItem(item.id);
                                 loadCard();
                               }}
                               className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-trello-gray-300 rounded"
                               >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          
                          {addingItemTo === checklist.id ? (
                            <div className="mt-2 pl-6">
                              <input
                                type="text"
                                autoFocus
                                value={newItemTitles[checklist.id] || ''}
                                onChange={(e) => setNewItemTitles(prev => ({ ...prev, [checklist.id]: e.target.value }))}
                                placeholder="Add an item"
                                className="w-full px-3 py-2 border border-trello-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-trello-blue mb-2 text-sm"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddChecklistItem(checklist.id, newItemTitles[checklist.id]);
                                    setNewItemTitles(prev => ({ ...prev, [checklist.id]: '' }));
                                    setAddingItemTo(null);
                                  } else if (e.key === 'Escape') {
                                    setAddingItemTo(null);
                                  }
                                }}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    handleAddChecklistItem(checklist.id, newItemTitles[checklist.id]);
                                    setNewItemTitles(prev => ({ ...prev, [checklist.id]: '' }));
                                    setAddingItemTo(null);
                                  }}
                                  className="btn btn-primary text-xs px-3 py-1.5"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => setAddingItemTo(null)}
                                  className="btn btn-secondary text-xs px-3 py-1.5"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingItemTo(checklist.id)}
                              className="ml-6 px-3 py-1.5 text-sm bg-trello-gray-200 hover:bg-trello-gray-300 text-trello-gray-900 rounded font-medium mt-1 w-auto"
                            >
                              Add an item
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Attachments Section */}
              {card.attachments && card.attachments.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Paperclip className="w-5 h-5 text-trello-gray-700" />
                    <h3 className="text-sm font-semibold text-trello-gray-900">Attachments</h3>
                  </div>
                  <div className="space-y-3">
                    {card.attachments.map((file: any) => (
                       <div key={file.id} className="flex gap-4 items-start hover:bg-trello-gray-100 p-2 rounded-lg group transition-colors cursor-pointer" onClick={() => window.open(file.fileUrl, '_blank')}>
                        {(file.fileUrl.endsWith('.jpg') || file.fileUrl.endsWith('.png') || file.fileUrl.endsWith('.jpeg')) ? (
                           <div className="w-28 h-20 bg-cover bg-center rounded border border-gray-200 cursor-pointer" style={{ backgroundImage: `url(${file.fileUrl})` }} />
                        ) : file.fileUrl.endsWith('.mp4') ? (
                           <video className="w-28 h-20 rounded border border-gray-200 cursor-pointer object-cover" src={file.fileUrl} />
                        ) : (
                           <div className="w-28 h-20 flex bg-gray-200 items-center justify-center rounded font-bold text-gray-500 cursor-pointer border border-gray-300">DOC</div>
                        )}
                        <div className="flex flex-col py-1 pointer-events-none">
                          <span className="font-semibold text-sm text-trello-gray-900 break-all w-[300px]">{file.filename || 'Attachment'}</span>
                          <span className="text-xs text-trello-gray-600 mt-1">Added {format(new Date(file.createdAt), 'MMM d, yyyy')}</span>
                          <div className="flex gap-2 mt-2 pointer-events-auto">
                            <span className="text-sm text-trello-gray-600 hover:text-black underline cursor-pointer">View</span>
                            <span onClick={(e) => { e.stopPropagation(); handleSetCover(file.fileUrl); }} className="text-sm text-trello-gray-600 hover:text-black underline ml-2 cursor-pointer">Make cover</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                            {(comment.createdAt || comment.created_at) ? format(new Date((comment.createdAt || comment.created_at)), 'MMM d \'at\' h:mm a') : 'Just now'}
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
            <div className="w-full md:w-40 space-y-2 relative">
              <h4 className="text-xs font-semibold text-trello-gray-600 uppercase mb-2">Add to card</h4>
              
              <div className="relative">
                <button 
                  onClick={() => { setShowMembers(!showMembers); setShowLabels(false); setShowDates(false); setShowAddChecklist(false); }}
                  className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm"
                >
                  <User className="w-4 h-4" />
                  Members
                </button>
                {showMembers && (
                  <div className="absolute top-10 left-0 w-64 bg-white rounded shadow-xl z-10 p-2 border">
                    <h4 className="text-sm font-semibold mb-2 px-1 text-center text-gray-700">Members</h4>
                    <button onClick={() => setShowMembers(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X className="w-4 h-4" /></button>
                    <div className="space-y-1">
                      {currentBoard?.members?.map((member: any) => (
                        <div key={member.id} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleToggleMember(member.id)}>
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                            {member.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm flex-1">{member.full_name}</span>
                          {card.members?.some((m: any) => m.id === member.id) && <CheckSquare className="w-4 h-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => { setShowLabels(!showLabels); setShowMembers(false); setShowDates(false); setShowAddChecklist(false); }}
                  className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm"
                >
                  <Tag className="w-4 h-4" />
                  Labels
                </button>
                {showLabels && (
                  <div className="absolute top-10 left-0 w-64 bg-white rounded shadow-xl z-10 p-2 border">
                    <h4 className="text-sm font-semibold mb-2 px-1 text-center text-gray-700">Labels</h4>
                    <button onClick={() => setShowLabels(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X className="w-4 h-4" /></button>
                    <div className="space-y-1">
                      {currentBoard?.labels?.map((label: any) => (
                        <div key={label.id} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleToggleLabel(label.id)}>
                          <span className="w-full h-8 rounded px-2 flex justify-between items-center text-sm font-medium text-white" style={{ backgroundColor: label.color }}>
                            {label.name}
                            {card.labels?.some((l: any) => l.id === label.id) && <CheckSquare className="w-4 h-4 text-white" />}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
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
              
              <div className="relative">
                <button 
                  onClick={() => { setShowDates(!showDates); setShowMembers(false); setShowLabels(false); setShowAddChecklist(false); }}
                  className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Dates
                </button>
                {showDates && (
                  <div className="absolute top-10 left-0 w-64 bg-white rounded shadow-xl z-20 p-3 border">
                    <h4 className="text-sm font-semibold mb-3 px-1 text-center text-gray-700">Due Date</h4>
                    <button onClick={() => setShowDates(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"><X className="w-4 h-4" /></button>
                    <input 
                      type="datetime-local" 
                      className="w-full border rounded p-1 mb-2 text-sm font-sans"
                      defaultValue={card.due_date ? new Date(card.due_date).toISOString().slice(0, 16) : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) handleUpdateDate(new Date(val).toISOString());
                      }}
                    />
                    {card.due_date && (
                      <button 
                        onClick={() => handleUpdateDate('')}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 mt-1 rounded text-sm transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>

              <h4 className="text-xs font-semibold text-trello-gray-600 uppercase mb-2 mt-4">Actions</h4>
              
              <label className="w-full btn btn-secondary text-left flex items-center gap-2 text-sm hover:bg-trello-gray-200 cursor-pointer">
                <Paperclip className="w-4 h-4" />
                Attachment
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
              </label>

              <button
                onClick={handleDeleteCard}
                className="w-full mt-2 btn btn-secondary text-left flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
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
