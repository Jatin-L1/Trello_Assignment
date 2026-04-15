'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import Navbar from '@/components/Navbar';
import Board from '@/components/Board';
import BoardHeader from '@/components/BoardHeader';

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;
  const { currentBoard, loading, fetchBoard } = useBoardStore();

  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
    }
  }, [boardId, fetchBoard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-trello-blue flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="min-h-screen bg-trello-blue flex items-center justify-center">
        <div className="text-white text-xl">Board not found</div>
      </div>
    );
  }

  const backgroundColor = currentBoard.backgroundImage 
    ? 'transparent' 
    : currentBoard.backgroundColor;

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor,
        backgroundImage: currentBoard.backgroundImage 
          ? `url(${currentBoard.backgroundImage})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      <BoardHeader board={currentBoard} />
      <Board board={currentBoard} />
    </div>
  );
}
