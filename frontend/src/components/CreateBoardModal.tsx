'use client';

import { useState } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';
import { useBoardStore } from '@/store/boardStore';
import { useRouter } from 'next/navigation';

interface CreateBoardModalProps {
  onClose: () => void;
}

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1620803517453-2943e8bb8ba1?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&q=80&w=400'
];

const BACKGROUND_COLORS = [
  '#0079bf', '#d29034', '#519839', '#b04632'
];

export default function CreateBoardModal({ onClose }: CreateBoardModalProps) {
  const [title, setTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(BACKGROUND_IMAGES[0]);
  const [isTouched, setIsTouched] = useState(false);
  const { createBoard } = useBoardStore();
  const router = useRouter();

  const handleCreate = async () => {
    if (title.trim()) {
      const response = await createBoard({
        title: title.trim(),
        background_color: backgroundColor || '#0079bf',
        background_image: backgroundImage,
        created_by: '11111111-1111-1111-1111-111111111111',
      });
      onClose();
      // Navigate to the new board
      if (response) {
        router.push(`/board/${response.data.id}`);
      }
    }
  };

  const showError = isTouched && !title.trim();

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-24 z-50 pointer-events-none">
      {/* Invisible backdrop that catches clicks to close */}
      <div className="fixed inset-0 pointer-events-auto bg-black/60" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="bg-[#282e33] rounded-[3px] shadow-[0_8px_16px_-4px_rgba(9,30,66,0.25),0_0_0_1px_rgba(9,30,66,0.08)] w-full max-w-[304px] z-10 pointer-events-auto relative text-[#b6c2cf]">
        <div className="flex items-center justify-center p-3 border-b border-[#38414a] relative">
          <h2 className="text-[14px] font-[600] text-[#9fadbc]">Create board</h2>
          <button
            onClick={onClose}
            className="absolute right-2 p-1.5 hover:bg-[#a6c5e229] rounded-[3px] transition-colors text-[#9fadbc]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <div className="space-y-4">
            {/* Preview */}
            <div className="flex justify-center mb-4">
              <div 
                className="w-[200px] h-[120px] rounded-[3px] relative shadow-sm overflow-hidden p-2 flex gap-1.5"
                style={{
                  backgroundColor: backgroundColor || 'transparent',
                  backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Mock UI overlay for preview */}
                <div className="w-1/3 bg-[#f1f2f4]/80 rounded-[3px] flex flex-col gap-1 p-1">
                   <div className="h-2 w-3/4 bg-[#091e42]/20 rounded-[2px]" />
                   <div className="h-4 bg-white rounded-[2px] shadow-sm" />
                   <div className="h-4 bg-white rounded-[2px] shadow-sm" />
                </div>
                <div className="w-1/3 bg-[#f1f2f4]/80 rounded-[3px] flex flex-col gap-1 p-1">
                   <div className="h-2 w-1/2 bg-[#091e42]/20 rounded-[2px]" />
                   <div className="h-4 bg-white rounded-[2px] shadow-sm" />
                </div>
                <div className="w-1/3 bg-[#f1f2f4]/40 rounded-[3px] flex flex-col gap-1 p-1" />
              </div>
            </div>

            {/* Background Selection */}
            <div>
              <label className="block text-[12px] font-[700] text-[#9fadbc] mb-1 leading-4">
                Background
              </label>
              
              <div className="flex gap-[6px] mb-[6px]">
                {BACKGROUND_IMAGES.map((img) => (
                  <button
                    key={img}
                    onClick={() => {
                      setBackgroundImage(img);
                      setBackgroundColor(null);
                    }}
                    className="w-[64px] h-[40px] rounded-[3px] flex-1 transition-all bg-cover bg-center relative group"
                    style={{ backgroundImage: `url(${img})` }}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 rounded-[3px]" />
                    {backgroundImage === img && <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-[3px]"><Check className="w-4 h-4 text-white" /></div>}
                  </button>
                ))}
              </div>

              <div className="flex gap-[6px]">
                {BACKGROUND_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setBackgroundColor(color);
                      setBackgroundImage(null);
                    }}
                    className="w-[32px] h-[32px] rounded-[3px] flex-1 transition-all relative group"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 rounded-[3px]" />
                    {backgroundColor === color && !backgroundImage && <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[3px]"><Check className="w-4 h-4 text-white" /></div>}
                  </button>
                ))}
                <button className="w-[32px] h-[32px] flex-1 rounded-[3px] bg-[#a6c5e229] hover:bg-[#a6c5e229]/80 flex items-center justify-center text-[#9fadbc] transition-colors">
                  <span className="leading-none pb-2 tracking-widest text-lg">...</span>
                </button>
              </div>
            </div>

            {/* Title Input */}
            <div className="relative pt-2">
              <label className={`block text-[12px] font-[700] mb-1 leading-4 ${showError ? 'text-red-400' : 'text-[#9fadbc]'}`}>
                Board title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setIsTouched(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className={`w-full bg-[#22272b] text-[#b6c2cf] text-[14px] px-3 py-[6px] rounded-[3px] focus:outline-none transition-colors ${
                   showError 
                    ? 'border-2 border-red-500 shadow-[inset_0_0_0_2px_#ef4444]' 
                    : 'border border-[#738496] focus:border-[#579dff] focus:shadow-[inset_0_0_0_1px_#579dff] hover:bg-[#282e33]'
                }`}
                autoFocus
              />
              {showError && (
                <div className="text-[14px] items-center gap-1 text-[#b6c2cf] mt-2 flex">
                  <span>👋</span> Board title is required
                </div>
              )}
            </div>

            {/* Visibility Option */}
            <div className="pt-2">
              <label className="block text-[12px] font-[700] text-[#9fadbc] mb-1 leading-4">
                Visibility
              </label>
              <button className="w-full flex items-center justify-between bg-[#22272b] hover:bg-[#a6c5e229] border border-[#738496] px-3 py-[6px] rounded-[3px] text-[14px] font-[400] text-[#b6c2cf] transition-colors">
                 Workspace
                 <ChevronDown className="w-4 h-4 text-[#9fadbc]" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleCreate}
                disabled={!title.trim()}
                className={`w-full py-[6px] px-3 rounded-[3px] text-[14px] font-[500] transition-colors ${
                  !title.trim() 
                    ? 'bg-[#a6c5e229] text-[#9fadbc] cursor-not-allowed opacity-50' 
                    : 'bg-[#579dff] text-[#1d2125] hover:bg-[#85b8ff]'
                }`}
              >
                Create
              </button>
              <button onClick={onClose} className="w-full bg-[#a6c5e229] hover:bg-[#a6c5e229]/80 text-[#b6c2cf] py-[6px] px-3 rounded-[3px] text-[14px] font-[500] transition-colors">
                Start with a template
              </button>
            </div>
            
            <p className="text-[11px] text-[#9fadbc] text-center mt-2 leading-[1.3]">
               By using images from Unsplash, you agree to their <a href="#" className="underline text-[#579dff]">license</a> and <a href="#" className="underline text-[#579dff]">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
