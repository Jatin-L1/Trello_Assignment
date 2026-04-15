'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import List from './List';
import Card from './Card';
import CreateListButton from './CreateListButton';
import { useBoardStore } from '@/store/boardStore';

interface BoardProps {
  board: {
    id: string;
    lists: any[];
  };
}

export default function Board({ board }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'list' | null>(null);
  const { optimisticMoveCard, moveCard, optimisticMoveList, moveList } = useBoardStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Determine if dragging a card or list
    const isCard = active.data.current?.type === 'card';
    setActiveType(isCard ? 'card' : 'list');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Only handle card dragging here
    if (activeType !== 'card') return;

    const activeListId = active.data.current?.listId;
    const overListId = overType === 'card' ? over.data.current?.listId : overId;

    if (!activeListId || !overListId) return;

    // Find the lists
    const activeList = (board.lists || []).find((l) => l.id === activeListId);
    const overList = (board.lists || []).find((l) => l.id === overListId);

    if (!activeList || !overList) return;

    // Calculate new position
    let newPosition = 0;
    if (overType === 'card') {
      const overCard = overList.cards.find((c: any) => c.id === overId);
      newPosition = overCard ? overCard.position : 0;
    } else {
      newPosition = overList.cards.length;
    }

    // Optimistic update
    optimisticMoveCard(activeId, activeListId, overListId, newPosition);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeType = active.data.current?.type;

    if (activeType === 'list') {
      // Handle list reordering
      const oldIndex = (board.lists || []).findIndex((l) => l.id === activeId);
      const newIndex = (board.lists || []).findIndex((l) => l.id === overId);

      if (oldIndex !== newIndex) {
        optimisticMoveList(activeId, newIndex);
        await moveList(activeId, newIndex);
      }
    } else if (activeType === 'card') {
      // Handle card movement
      const activeListId = active.data.current?.listId;
      const overType = over.data.current?.type;
      const overListId = overType === 'card' ? over.data.current?.listId : overId;

      if (!activeListId || !overListId) return;

      const overList = (board.lists || []).find((l) => l.id === overListId);
      if (!overList) return;

      let newPosition = 0;
      if (overType === 'card') {
        const overCard = overList.cards.find((c: any) => c.id === overId);
        newPosition = overCard ? overCard.position : 0;
      } else {
        newPosition = overList.cards.length;
      }

      // API call
      await moveCard(activeId, overListId, newPosition);
    }
  };

  const activeCard = activeType === 'card' && activeId
    ? (board.lists || [])
        .flatMap((l) => l.cards)
        .find((c) => c.id === activeId)
    : null;

  const activeList = activeType === 'list' && activeId
    ? (board.lists || []).find((l) => l.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-3 p-4 h-full items-start">
          <SortableContext
            items={(board.lists || []).map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            {(board.lists || []).map((list) => (
              <List key={list.id} list={list} />
            ))}
          </SortableContext>
          
          <CreateListButton boardId={board.id} />
        </div>
      </div>

      <DragOverlay>
        {activeCard && <Card card={activeCard} isDragging />}
        {activeList && (
          <div className="w-72 bg-trello-gray-100 rounded-lg p-2 shadow-lg opacity-90">
            <div className="font-semibold text-trello-gray-900 mb-2">{activeList.title}</div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
