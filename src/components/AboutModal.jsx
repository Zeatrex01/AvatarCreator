import React from 'react';
import { X, Info, ExternalLink, Code2, Heart, Star, Globe } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const libraries = [
    {
      name: 'DiceBear',
      description: 'Open source avatar library used for generating the core avatar SVGs.',
      url: 'https://www.dicebear.com',
      author: 'Florian Körner'
    },
    {
      name: 'React',
      description: 'A JavaScript library for building user interfaces.',
      url: 'https://react.dev',
      author: 'Meta'
    },
    {
      name: 'Tailwind CSS',
      description: 'A utility-first CSS framework for rapid UI development.',
      url: 'https://tailwindcss.com',
      author: 'Tailwind Labs'
    },
    {
      name: 'Lucide Icons',
      description: 'Beautiful & consistent icon toolkit used throughout the app.',
      url: 'https://lucide.dev',
      author: 'Lucide Contributors'
    },
    {
      name: 'React Image Crop',
      description: 'A responsive image cropping tool for React.',
      url: 'https://github.com/DominicTobias/react-image-crop',
      author: 'Dominic Tobias'
    },
    {
      name: 'JSZip & FileSaver',
      description: 'Utilities used for generating and downloading the batch avatar exports.',
      url: 'https://stuk.github.io/jszip/',
      author: 'Stuart Knightley'
    }
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-transparent flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Info size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">About & Credits</h2>
              <p className="text-sm text-slate-500 font-medium">Open source libraries and tools used in this project</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          <div className="mb-8 p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 shrink-0">
              <Code2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Avatar Creator Project</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                This project was developed as a modern, standalone web application for generating, customizing, and exporting high-quality SVG/PNG avatars. It is fully prepared for Vercel deployment. 
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Star size={18} className="text-amber-400" />
            <h3 className="text-lg font-bold text-slate-800">Open Source Acknowledgements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {libraries.map((lib) => (
              <a 
                key={lib.name}
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{lib.name}</h4>
                  <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-500" />
                </div>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{lib.description}</p>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  By {lib.author}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-200/60 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
            Made with <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" /> for the community
          </div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Globe size={16} />
            Source Code
          </a>
        </div>

      </div>
    </div>
  );
};

export default AboutModal;
