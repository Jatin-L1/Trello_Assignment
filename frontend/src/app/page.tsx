'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import Navbar from '@/components/Navbar';
import BoardCard from '@/components/BoardCard';
import CreateBoardModal from '@/components/CreateBoardModal';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { boards, loading, fetchBoards } = useBoardStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-trello-blue to-blue-600">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Boards</h1>
          <p className="text-blue-100">Manage your projects with ease</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onClick={() => router.push(`/board/${board.id}`)}
              />
            ))}
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="h-32 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg border-2 border-dashed border-white/40 flex items-center justify-center text-white transition-all duration-200 group"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Create New Board</span>
              </div>
            </button>
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateBoardModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
