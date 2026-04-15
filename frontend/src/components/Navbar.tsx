'use client';

import Link from 'next/link';
import { Home, Search, Bell, User } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useState } from 'react';

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useBoardStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-1.5 rounded transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-semibold hidden sm:inline">Boards</span>
          </Link>
        </div>

        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
          <h1 className="text-xl font-bold text-white tracking-tight">Trello Clone</h1>
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 relative">
                 <input
                   type="text"
                   autoFocus
                   placeholder="Search cards..."
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   onBlur={() => !searchQuery && setIsSearchOpen(false)}
                   className="bg-white/90 text-sm text-trello-gray-900 px-3 py-1 rounded focus:outline-none w-48"
                 />
                 <Search className="w-4 h-4 absolute right-2 text-gray-500" />
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-white hover:bg-white/10 p-2 rounded transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
          <button className="text-white hover:bg-white/10 p-2 rounded transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-white hover:bg-white/10 p-2 rounded transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
