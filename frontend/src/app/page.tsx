'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import Navbar from '@/components/Navbar';
import BoardCard from '@/components/BoardCard';
import CreateBoardModal from '@/components/CreateBoardModal';
import { Plus, Users, Settings, LayoutTemplate, Activity, Clock, Star, Layout, Trello, Copy, Puzzle, Settings as Gear, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { boards, loading, fetchBoards, searchQuery, deleteBoard } = useBoardStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAppView, setIsAppView] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const filteredBoards = boards.filter((b) => 
    b.title.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const starredBoards = filteredBoards.filter((b) => b.isStarred);

  if (!isAppView) {
    return (
      <div className="min-h-screen bg-[#ffffff]">
        {/* Public Trello Header */}
        <header className="sticky top-0 z-50 bg-[#ffffff] border-b border-gray-200 shadow-sm">
          <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-[#0052CC] font-bold text-2xl tracking-tight cursor-pointer" onClick={() => setIsAppView(true)}>
                <Trello className="w-6 h-6" strokeWidth={2.5} />
                <span>Trello</span>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#091E42]">
                <button className="hover:text-[#0052CC] transition-colors flex items-center gap-1">Features <span className="text-xs">▼</span></button>
                <button className="hover:text-[#0052CC] transition-colors flex items-center gap-1">Solutions <span className="text-xs">▼</span></button>
                <button className="hover:text-[#0052CC] transition-colors flex items-center gap-1">Plans <span className="text-xs">▼</span></button>
                <button className="hover:text-[#0052CC] transition-colors">Pricing</button>
                <button className="hover:text-[#0052CC] transition-colors flex items-center gap-1">Resources <span className="text-xs">▼</span></button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAppView(true)} className="text-[17px] text-[#091E42] font-medium hover:underline hidden sm:block">Log in</button>
              <button onClick={() => setIsAppView(true)} className="bg-[#0065ff] text-white px-6 py-3 rounded-[0.2rem] text-[17px] font-medium hover:bg-[#0747a6] transition-colors shadow-sm">
                Get Trello for free
              </button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-[#eae6ff] to-[#ffffff] pt-24 pb-20">
            <div className="max-w-[1400px] mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 max-w-2xl px-2">
                <h1 className="text-[3rem] font-bold text-[#091E42] leading-[1.2] tracking-tight">
                  Trello brings all your tasks, teammates, and tools together
                </h1>
                <p className="text-[1.25rem] text-[#091E42] leading-relaxed">
                  Keep everything in the same place—even if your team isn't.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-lg max-w-[400px]"
                  />
                  <button onClick={() => setIsAppView(true)} className="bg-[#0065ff] text-white px-8 py-3 rounded-[0.2rem] text-[1.1rem] font-medium hover:bg-[#0747a6] transition-colors whitespace-nowrap">
                    Sign up - it's free!
                  </button>
                </div>
              </div>
              
              <div className="w-full flex justify-center items-center drop-shadow-2xl">
                 <video autoPlay loop muted playsInline className="w-[100%] max-w-[650px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-md">
                    <source src="/video/updatedhero-mobile-final.mp4" type="video/mp4" />
                 </video>
              </div>
            </div>
          </section>

          {/* Social Proof Logos */}
          <section className="py-12 bg-[#ffffff]">
            <div className="max-w-[1400px] mx-auto px-4 text-center">
              <p className="text-[1.25rem] text-[#091E42] mb-12">Join over 2,000,000 teams worldwide that are using Trello to get more done.</p>
              <div className="flex justify-center items-center">
                <img src="/Pic/image1_files/logos-horizontal-visa-coinbase-john-deere-zoom-grand-hyatt-fender.svg" alt="Company Logos" className="max-w-[80%] md:max-w-[1000px] opacity-80" />
              </div>
            </div>
          </section>

          {/* From message to action */}
          <section className="bg-gradient-to-r from-[#0052CC] to-[#0065FF] text-white py-24">
            <div className="max-w-[1400px] mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <p className="text-[1rem] font-bold uppercase tracking-widest text-[#69a1ff]">Trello 101</p>
                <h2 className="text-[2.5rem] font-bold mb-6">A productivity powerhouse</h2>
                <p className="text-[1.25rem] text-[#e6fcff] leading-relaxed">
                  Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a clear view of who's doing what and what needs to get done. Learn more in our guide for getting started.
                </p>
              </div>
              <div className="flex justify-center">
                <img src="/Pic/image1_files/board-slider.png" alt="Board view" className="shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-lg w-full max-w-[600px] object-cover" />
              </div>
            </div>
          </section>

          {/* Trello 101 Section Alternative (Use Inbox and Planner) */}
          <section className="py-24 bg-[#ffffff]">
            <div className="max-w-[1400px] mx-auto px-4">
              <h2 className="text-[2.25rem] font-bold text-[#091E42] mb-16 text-center">Explore the features that help your team succeed</h2>
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 flex justify-center">
                  <img src="/Pic/image1_files/inbox-slider.png" alt="Inbox view" className="shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-lg w-full max-w-[500px]" />
                </div>
                <div className="order-1 md:order-2 space-y-6">
                   <h3 className="text-[2rem] font-bold text-[#091E42]">See work in a whole new way</h3>
                   <p className="text-[1.25rem] text-[#091E42] leading-relaxed">
                     View your team's projects from every angle and bring a fresh perspective to the task at hand. Keep tabs on everything from a high-level overview to the nitty-gritty details.
                   </p>
                   <ul className="text-[1.1rem] space-y-4 text-[#091E42] pt-4">
                     <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#0052cc]"></span> Keep track of tasks with Lists</li>
                     <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#0052cc]"></span> Use Cards to manage specifics</li>
                     <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#0052cc]"></span> See progress in the Timeline</li>
                   </ul>
                </div>
              </div>
            </div>
          </section>
          
          {/* Do more with Trello Section */}
          <section className="py-24 bg-[#fafbfc] border-t border-gray-200">
            <div className="max-w-[1400px] mx-auto px-4">
              <h2 className="text-[2.5rem] font-bold text-[#091E42] mb-16 text-center">Do more with Trello</h2>
              <div className="grid md:grid-cols-3 gap-10">
                <div className="p-8 bg-[#ffffff] shadow-sm rounded-lg flex flex-col items-start border border-gray-100">
                  <img src="/Pic/image1_files/Integration.svg" alt="Integrations" className="h-16 mb-8" />
                  <h3 className="text-[1.5rem] font-bold text-[#091E42] mb-4">Integrations</h3>
                  <p className="text-[1.1rem] text-[#091E42] mb-8 flex-1 leading-relaxed">Connect the apps your team already uses into your Trello workflow, or add a Power-Up that helps fine-tune one specific need.</p>
                  <button className="text-[#0052CC] font-semibold text-[1.1rem] hover:underline bg-gray-100 px-6 py-3 rounded-md w-full transition-colors">
                    Discover Integrations
                  </button>
                </div>
                <div className="p-8 bg-[#ffffff] shadow-sm rounded-lg flex flex-col items-start border border-gray-100">
                  <img src="/Pic/image1_files/Autodev.svg" alt="Automation" className="h-16 mb-8" />
                  <h3 className="text-[1.5rem] font-bold text-[#091E42] mb-4">Butler Automation</h3>
                  <p className="text-[1.1rem] text-[#091E42] mb-8 flex-1 leading-relaxed">No-code automation is built into every Trello board. Focus on the work that matters most and let the robots do the rest.</p>
                  <button className="text-[#0052CC] font-semibold text-[1.1rem] hover:underline bg-gray-100 px-6 py-3 rounded-md w-full transition-colors">
                    Get to know Butler
                  </button>
                </div>
                <div className="p-8 bg-[#ffffff] shadow-sm rounded-lg flex flex-col items-start border border-gray-100">
                  <img src="/Pic/image1_files/Project_management.svg" alt="Enterprise" className="h-16 mb-8" />
                  <h3 className="text-[1.5rem] font-bold text-[#091E42] mb-4">Trello Enterprise</h3>
                  <p className="text-[1.1rem] text-[#091E42] mb-8 flex-1 leading-relaxed">The productivity tool teams love, paired with the features and security needed for scale.</p>
                  <button className="text-[#0052CC] font-semibold text-[1.1rem] hover:underline bg-gray-100 px-6 py-3 rounded-md w-full transition-colors">
                    Explore Enterprise
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Pre-Area */}
          <section className="bg-[#172b4d] text-white py-16 text-center relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 z-10 relative">
               <h2 className="text-[2.25rem] font-bold mb-6">Get started with Trello today</h2>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <input 
                    type="email" 
                    placeholder="Email" 
                    className="px-4 py-3 border border-gray-600 rounded bg-[#172b4d] text-white focus:outline-none focus:ring-2 focus:ring-[#0052cc] text-lg w-[300px]"
                 />
                 <button onClick={() => setIsAppView(true)} className="bg-[#0065ff] px-8 py-3 rounded-[0.2rem] text-[1.1rem] font-medium hover:bg-[#0747a6] transition-colors whitespace-nowrap">
                   Sign up - it's free!
                 </button>
               </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1d2125]">
      <Navbar />

      <div className="flex h-[calc(100vh-48px)]">
        {/* Sidebar */}
        <aside className="w-[260px] flex-shrink-0 bg-[#1d2125] border-r border-[#38414a] overflow-y-auto hidden md:block px-3 py-4">
          <ul className="space-y-1 mb-4">
            <li>
              <Link href="/" className="flex items-center gap-3 px-3 py-2 text-[#9fadbc] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] rounded-md transition-colors text-[14px] font-semibold">
                <Trello className="w-4 h-4" /> Boards
              </Link>
            </li>
            <li>
              <Link href="/" className="flex items-center gap-3 px-3 py-2 text-[#9fadbc] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] rounded-md transition-colors text-[14px] font-semibold">
                <LayoutTemplate className="w-4 h-4" /> Templates
              </Link>
            </li>
            <li>
              <Link href="/" className="flex items-center gap-3 px-3 py-2 text-[#9fadbc] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] rounded-md transition-colors text-[14px] font-semibold">
                <Activity className="w-4 h-4" /> Home
              </Link>
            </li>
          </ul>

          <div className="pt-4 border-t border-[#38414a]">
            <div className="flex items-center justify-between px-3 py-2 text-[#9fadbc] text-[12px] font-bold group">
              <span>Workspaces</span>
              <button className="opacity-0 group-hover:opacity-100 hover:bg-[#a6c5e229] p-1 rounded transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1">
              <button className="w-full flex items-center justify-between px-3 py-2 text-[#b6c2cf] bg-[#a6c5e229] rounded-md text-[14px] font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    T
                  </div>
                  Trello Workspace
                </div>
              </button>
              <ul className="pl-9 mt-1 space-y-1">
                <li>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[#9fadbc] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] rounded-md text-[14px] font-medium transition-colors">
                    <Trello className="w-4 h-4" /> Boards
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-[#9fadbc] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] rounded-md text-[14px] font-medium transition-colors">
                    <Users className="w-4 h-4" /> Members
                  </button>
                </li>
                <li>
                  <button className="w-full flex items-center justify-between px-3 py-2 text-[#9fadbc] hover:bg-[#a6c5e229] hover:text-[#b6c2cf] rounded-md text-[14px] font-medium transition-colors">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Settings
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#1d2125]">
          <div className="max-w-[825px] mx-auto px-4 py-8">
            
            {/* Starred boards */}
            {starredBoards.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 text-[#b6c2cf] mb-4 font-bold text-[16px]">
                  <Star className="w-6 h-6" />
                  <h2>Starred boards</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {starredBoards.map((board) => (
                    <BoardCard 
                      key={board.id} 
                      board={board} 
                      onClick={() => router.push(`/board/${board.id}`)} 
                      onDelete={() => deleteBoard(board.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recently viewed */}
            {filteredBoards.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 text-[#b6c2cf] mb-4 font-bold text-[16px]">
                  <Clock className="w-6 h-6" />
                  <h2>Recently viewed</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredBoards.slice(0, 4).map((board) => (
                    <BoardCard 
                      key={board.id} 
                      board={board} 
                      onClick={() => router.push(`/board/${board.id}`)} 
                      onDelete={() => deleteBoard(board.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Your Workspaces */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <h2 className="text-[16px] font-bold text-[#b6c2cf]">Trello Workspace</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="hidden sm:flex items-center gap-1 text-[#b6c2cf] bg-[#a6c5e229] hover:bg-[#a6c5e229]/80 px-3 py-[6px] rounded transition-colors text-[14px] font-medium">
                    <Trello className="w-4 h-4" /> Boards
                  </button>
                  <button className="hidden sm:flex items-center gap-1 text-[#b6c2cf] bg-[#a6c5e229] hover:bg-[#a6c5e229]/80 px-3 py-[6px] rounded transition-colors text-[14px] font-medium">
                    <Layout className="w-4 h-4" /> Views
                  </button>
                  <button className="hidden sm:flex items-center gap-1 text-[#b6c2cf] bg-[#a6c5e229] hover:bg-[#a6c5e229]/80 px-3 py-[6px] rounded transition-colors text-[14px] font-medium">
                    <Users className="w-4 h-4" /> Members
                  </button>
                  <button className="hidden sm:flex items-center gap-1 text-[#b6c2cf] bg-[#a6c5e229] hover:bg-[#a6c5e229]/80 px-3 py-[6px] rounded transition-colors text-[14px] font-medium">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                </div>
              </div>

              {loading ? (
                 <div className="text-[#9fadbc] text-[14px]">Loading boards...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredBoards.map((board) => (
                    <BoardCard 
                      key={board.id} 
                      board={board} 
                      onClick={() => router.push(`/board/${board.id}`)} 
                      onDelete={() => deleteBoard(board.id)} 
                    />
                  ))}

                  {/* Create new board card */}
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center bg-[#282e33] hover:bg-[#323940] text-[#b6c2cf] h-[96px] rounded shadow-sm hover:shadow transition-all group border-none"
                  >
                    <span className="text-[14px] font-medium group-hover:underline">
                      Create new board
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showCreateModal && (
        <CreateBoardModal 
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </div>
  );
}

