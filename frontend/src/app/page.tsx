'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import Navbar from '@/components/Navbar';
import BoardCard from '@/components/BoardCard';
import CreateBoardModal from '@/components/CreateBoardModal';
import { Plus, Users, Settings, LayoutTemplate, Activity, Clock, Star, Layout, Trello, Copy, Puzzle, Settings as Gear } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { boards, loading, fetchBoards } = useBoardStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isAppView, setIsAppView] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const starredBoards = boards.filter((b) => b.isStarred);

  if (!isAppView) {
    return (
      <div className="min-h-screen bg-white">
        {/* Public Trello Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl tracking-tight">
                <Trello className="w-6 h-6" strokeWidth={2.5} />
                <span>Trello</span>
              </div>
              <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-700">
                <button className="hover:text-blue-600 transition-colors">Features ⏷</button>
                <button className="hover:text-blue-600 transition-colors">Solutions ⏷</button>
                <button className="hover:text-blue-600 transition-colors">Plans ⏷</button>
                <button className="hover:text-blue-600 transition-colors">Pricing</button>
                <button className="hover:text-blue-600 transition-colors">Resources ⏷</button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAppView(true)} className="text-[15px] text-[#091E42] font-medium hover:underline hidden sm:block">Log in</button>
              <button onClick={() => setIsAppView(true)} className="bg-[#0052CC] text-white px-5 py-2.5 rounded text-[15px] font-medium hover:bg-blue-700 transition-colors">
                Get Trello for free
              </button>
            </div>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <h1 className="text-5xl font-bold text-[#091E42] leading-[1.1] tracking-tight">
                Capture, organize, and tackle your to-dos from anywhere.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Escape the clutter and chaos—unleash your productivity with Trello.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <button onClick={() => setIsAppView(true)} className="bg-[#0052CC] text-white px-8 py-3 rounded text-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                  Sign up - it's free!
                </button>
              </div>
              <p className="text-sm text-gray-500 pt-1">
                By entering my email, I acknowledge the <a href="#" className="text-blue-600 underline">Atlassian Privacy Policy</a>
              </p>
            </div>
            
            <div className="relative h-[550px] w-full flex justify-center items-center">
              {/* Mock App Device graphic mimicking the layout in hero image */}
              <div className="relative z-10 w-[280px] h-[580px] bg-blue-600 rounded-[3rem] border-[12px] border-[#091E42] shadow-2xl overflow-hidden flex flex-col transform rotate-[-5deg] scale-95">
                  <div className="p-6 text-white">
                    <h3 className="font-bold mb-4 text-xl">Inbox</h3>
                    <div className="bg-white rounded-lg p-3 text-[#172b4d] shadow-sm mb-3 border-l-4 border-yellow-400">
                      <p className="text-sm font-medium">Your stay in Austin</p>
                      <div className="flex gap-1 mt-2">
                        <div className="w-4 h-4 rounded-full bg-red-400"></div>
                        <div className="w-4 h-4 rounded-full bg-green-400"></div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-[#172b4d] shadow-sm mb-3 border-l-4 border-green-500">
                      <p className="text-sm font-medium">Prepare analysis of recent campaigns</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-[#172b4d] shadow-sm border-l-4 border-purple-500">
                      <p className="text-sm font-medium">Marketing presentation got moved up to Friday</p>
                    </div>
                  </div>
              </div>
              {/* Colorful decorative shapes behind phone */}
              <div className="absolute top-10 right-0 w-64 h-64 bg-orange-400 rounded-lg transform rotate-12 -z-10"></div>
              <div className="absolute bottom-[-20px] left-10 w-48 h-48 bg-purple-500 rounded-full -z-10"></div>
            </div>
          </section>

          {/* Social Proof Logos */}
          <section className="py-12 border-y border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-xl text-[#091E42] mb-12">Join a community of millions of users globally who are using Trello to get more done.</p>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                <span className="text-3xl font-black tracking-widest uppercase">VISA</span>
                <span className="text-3xl font-black lowercase text-blue-600">coinbase</span>
                <span className="text-2xl font-bold uppercase text-green-700 flex items-center gap-2"><Activity/> JOHN DEERE</span>
                <span className="text-4xl font-bold text-blue-500 tracking-tighter">zoom</span>
                <span className="text-2xl font-serif uppercase tracking-widest">GRAND HYATT</span>
              </div>
            </div>
          </section>

          {/* From message to action */}
          <section className="bg-[#0052CC] text-white py-24">
            <div className="max-w-4xl mx-auto text-center px-4 mb-20">
              <h2 className="text-4xl font-bold mb-6">From message to action</h2>
              <p className="text-xl text-blue-100">Quickly turn communication from your favorite apps into to-dos, keeping all your discussions and tasks organized in one place.</p>
            </div>
            
            <div className="max-w-5xl mx-auto px-4 bg-white rounded-2xl p-10 shadow-2xl text-[#091E42] flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Copy className="w-4 h-4"/> MESSAGE APP SORCERY</p>
                <div className="text-xl text-gray-600 leading-relaxed">
                  Need to follow up on a message from Slack or Microsoft Teams? Send it directly to your Trello board! Your favorite app interface lets you save messages that appear in your Trello Inbox with AI-generated summaries and links.
                </div>
              </div>
              <div className="flex-1 bg-green-100 rounded-xl p-8 relative overflow-hidden h-64 flex justify-center items-center">
                  <div className="bg-[#3F6634] text-white p-4 rounded-lg shadow-xl w-64 z-10">
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2"> <Copy className="w-4 h-4"/> Inbox</h4>
                    <div className="bg-white/20 p-2 rounded text-sm mb-2 shadow-sm">Send Banc.ly Competitive Analysis Draft to Gabrielle</div>
                    <div className="h-16 bg-white/10 rounded w-full"></div>
                  </div>
              </div>
            </div>
          </section>

          {/* Trello 101 Section */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4">
              <div className="max-w-3xl mb-16">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Trello 101</p>
                <h2 className="text-4xl font-bold text-[#091E42] mb-6">Your productivity powerhouse</h2>
                <p className="text-xl text-gray-600">
                  Stay organized and efficient with Inbox, Boards, and Planner. Every to-do, idea, or responsibility—no matter how small—finds its place, keeping you at the top of your game.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-[#091E42] mb-3">Inbox</h3>
                  <p className="text-gray-600 leading-relaxed">When it's on your mind, it goes in your Inbox. Capture your to-dos from anywhere, anytime.</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow border-t-4 border-t-blue-600">
                  <h3 className="text-xl font-bold text-[#091E42] mb-3">Boards</h3>
                  <p className="text-gray-600 leading-relaxed">Your to-do list may be long, but it can be manageable! Keep tabs on everything from "to-dos to tackle" to "mission accomplished!"</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-[#091E42] mb-3">Planner</h3>
                  <p className="text-gray-600 leading-relaxed">Drag, drop, get it done. Snap your top tasks into your calendar and make time for what truly matters.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Do more with Trello Section */}
          <section className="py-24 bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Work Smarter</p>
              <h2 className="text-4xl font-bold text-[#091E42] mb-12">Do more with Trello</h2>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-xl flex flex-col items-start hover:shadow-md transition-shadow">
                  <Puzzle className="w-12 h-12 text-blue-600 mb-6" />
                  <h3 className="text-xl font-bold text-[#091E42] mb-4">Integrations</h3>
                  <p className="text-gray-600 mb-8 flex-1">Connect the apps you are already using into your Trello workflow or add a Power-Up to fine-tune your specific needs.</p>
                  <button className="px-5 py-2.5 border border-gray-300 rounded text-[#091E42] font-semibold hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    Browse Integrations
                  </button>
                </div>
                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-xl flex flex-col items-start hover:shadow-md transition-shadow">
                  <Gear className="w-12 h-12 text-purple-600 mb-6" />
                  <h3 className="text-xl font-bold text-[#091E42] mb-4">Automation</h3>
                  <p className="text-gray-600 mb-8 flex-1">No-code automation is built into every Trello board. Focus on the work that matters most and let the robots do the rest.</p>
                  <button className="px-5 py-2.5 border border-gray-300 rounded text-[#091E42] font-semibold hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    Get to know Automation
                  </button>
                </div>
                <div className="p-8 bg-white shadow-sm border border-gray-100 rounded-xl flex flex-col items-start hover:shadow-md transition-shadow">
                  <Copy className="w-12 h-12 text-orange-500 mb-6" />
                  <h3 className="text-xl font-bold text-[#091E42] mb-4">Card mirroring</h3>
                  <p className="text-gray-600 mb-8 flex-1">View all your to-dos from multiple boards in one place. Mirror a card to keep track of work wherever you need it!</p>
                  <button className="px-5 py-2.5 border border-gray-300 rounded text-[#091E42] font-semibold hover:bg-gray-50 transition-colors w-full sm:w-auto">
                    Compare plans
                  </button>
                </div>
              </div>
              
              {/* Testimonial */}
              <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="flex-1 p-12 flex flex-col justify-center">
                  <p className="text-2xl text-[#091E42] leading-relaxed mb-8 font-medium">
                    "[Trello is] great for simplifying complex processes. As a manager, I can chunk [processes] down into bite-sized pieces for my team and then delegate that out, but still keep a bird's-eye view."
                  </p>
                  <div className="border-t-2 border-gray-200 pt-6 w-16 mb-4"></div>
                  <div>
                    <p className="font-bold text-[#091E42] text-lg">Joey Rosenberg</p>
                    <p className="text-gray-500">Global Leadership Director at Women Who Code</p>
                  </div>
                </div>
                <div className="md:w-2/5 bg-[#0052CC] p-12 text-white flex flex-col justify-center">
                  <p className="text-3xl font-bold mb-6 leading-tight">75% of organizations report that Trello delivers value to their business within 30 days.</p>
                  <a href="#" className="underline text-blue-200 hover:text-white transition-colors">Trello TechValidate Survey</a>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Footer */}
        <footer className="bg-[#172B4D] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-4">
                <Trello className="w-6 h-6" strokeWidth={2.5} />
                <span>Atlassian Trello</span>
              </div>
               <button onClick={() => setIsAppView(true)} className="bg-[#0052CC] text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors mt-4">
                 Go to your Workspace
               </button>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">About Trello</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">What's behind the boards.</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Jobs</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Learn about open roles on the Trello team.</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 uppercase text-sm tracking-wider">Contact us</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Need anything? Get in touch and we can help.</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard App View
  return (
    <div className="min-h-screen flex flex-col bg-[#1d2125] text-[#b6c2cf]">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden mt-10 max-w-7xl mx-auto w-full px-4 gap-8 pb-10">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 bg-[#333c43] text-white rounded-md font-medium">
              <Trello className="w-4 h-4" />
              Boards
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#9fadbc] hover:bg-[#282e33] rounded-md font-medium transition-colors">
              <LayoutTemplate className="w-4 h-4" />
              Templates
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 text-[#9fadbc] hover:bg-[#282e33] rounded-md font-medium transition-colors">
              <Activity className="w-4 h-4" />
              Home
            </a>
          </nav>

          <div className="pt-4 border-t border-[#38414a]">
            <div className="flex items-center justify-between px-3 py-2 mb-1 group">
              <span className="text-xs font-semibold text-[#9fadbc] uppercase tracking-wider">Workspaces</span>
              <button className="text-[#9fadbc] hover:bg-[#282e33] p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    T
                  </div>
                  <span className="font-bold text-[#b6c2cf]">Trello Workspace</span>
                </div>
                <div className="pl-11">
                  <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#9fadbc] hover:bg-[#282e33] rounded-md transition-colors">
                    <Trello className="w-4 h-4" /> Boards
                  </a>
                  <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#9fadbc] hover:bg-[#282e33] rounded-md transition-colors">
                    <Users className="w-4 h-4" /> Members
                  </a>
                  <a href="#" className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#9fadbc] hover:bg-[#282e33] rounded-md transition-colors">
                    <Gear className="w-4 h-4" /> Settings
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Starred Boards Section */}
              {starredBoards.length > 0 && (
                 <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-6 h-6 text-[#9fadbc] fill-current" />
                    <h2 className="text-base font-bold text-[#b6c2cf] uppercase tracking-wide">Starred boards</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-b border-[#38414a] pb-8">
                    {starredBoards.map((board) => (
                      <BoardCard
                        key={board.id}
                        board={board}
                        onClick={() => router.push(`/board/${board.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Boards Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-[#9fadbc]" />
                  <h2 className="text-base font-bold text-[#b6c2cf] uppercase tracking-wide">Recently viewed</h2>
                </div>
                
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
                    className="h-24 bg-[#282e33] hover:bg-[#333c43] rounded-[3px] flex items-center justify-center text-[#b6c2cf] transition-all duration-200"
                  >
                    <div className="text-center flex items-center gap-1">
                      <span className="text-[14px] font-medium">Create new board</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateBoardModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
