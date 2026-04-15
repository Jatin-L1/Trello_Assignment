'use client';

import Link from 'next/link';
import { Home, Search, Bell, User, Trello } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useState } from 'react';

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useBoardStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="bg-[#1d2125] border-b border-[#38414a] sticky top-0 z-50">
      <div className="px-4 h-[48px] flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="flex items-center gap-1 hover:bg-[#a6c5e229] px-2 py-1.5 rounded transition-colors text-white"
          >
            <Trello className="w-[16px] h-[16px] text-[#579dff] bg-transparent" strokeWidth={2.5} />
            <span className="font-bold text-[14px] leading-4">Trello</span>
          </Link>
          <div className="hidden md:flex items-center">
              <button className="flex items-center gap-1 text-[#b6c2cf] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] px-3 py-[6px] rounded transition-colors text-[14px] font-medium leading-[20px]">
                Workspaces <span className="text-[10px]">⏷</span>
              </button>
              <button className="flex items-center gap-1 text-[#b6c2cf] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] px-3 py-[6px] rounded transition-colors text-[14px] font-medium leading-[20px]">
                Recent <span className="text-[10px]">⏷</span>
              </button>
              <button className="flex items-center gap-1 text-[#b6c2cf] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] px-3 py-[6px] rounded transition-colors text-[14px] font-medium leading-[20px]">
                Starred <span className="text-[10px]">⏷</span>
              </button>
              <button className="flex items-center gap-1 text-[#b6c2cf] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] px-3 py-[6px] rounded transition-colors text-[14px] font-medium leading-[20px]">
                Templates <span className="text-[10px]">⏷</span>
              </button>
              <button 
                className="bg-[#579dff] text-[#1d2125] font-medium text-[14px] px-3 py-[6px] rounded ml-1 hover:bg-[#85b8ff] transition-colors leading-[20px]"
              >
                Create
              </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center gap-2 relative">
                <Search className="w-4 h-4 text-[#9fadbc] absolute left-2 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setIsSearchOpen(false)}
                  className="bg-[#22272b] border border-[#579dff] text-[#b6c2cf] placeholder-[#9fadbc] text-[14px] pl-8 pr-3 py-1 rounded focus:outline-none w-56 transition-all"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-between text-[#b6c2cf] border border-[#738496] focus-within:border-[#579dff] bg-[#22272b] hover:bg-[#282e33] px-2 py-1 rounded transition-colors w-[200px]"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-[16px] h-[16px] text-[#9fadbc]" />
                  <span className="text-[14px] text-[#b6c2cf]">Search</span>
                </div>
              </button>
            )}
          </div>

          {/* Notifications & Profile */}
          <div className="flex items-center gap-2">
            <button
              className="text-[#9fadbc] hover:bg-[#a6c5e229] w-[32px] h-[32px] flex items-center justify-center rounded-full transition-colors"
              title="Notifications"
            >
              <Bell className="w-[20px] h-[20px] leading-5" />
            </button>

            <button
              className="w-[24px] h-[24px] bg-gradient-to-br from-[#0c66e4] to-[#579dff] rounded-full flex items-center justify-center text-white text-[12px] font-bold border border-transparent hover:border-[#b6c2cf]"
              title="Profile"
            >
              J
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
