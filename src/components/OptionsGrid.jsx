import React from 'react';
import { Check } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { COLORS, COLOR_LABELS } from '../utils/constants';

export default function OptionsGrid({
  visibleTabs,
  activeTab,
  setActiveTab,
  activeTabData,
  options,
  handleOptionChange,
  displayedOptions,
  getPayloadFromOptions
}) {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative min-h-0 rounded-t-[2rem] lg:rounded-none shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] lg:shadow-none z-20 mt-2 lg:mt-0">
      {/* Mobile Drag Handle Indicator */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-4 flex items-center justify-center bg-white rounded-t-[2rem]">
         <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
      </div>
      <div className="px-4 lg:px-6 pt-6 pb-0 bg-white border-b border-slate-200 shrink-0">
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {visibleTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {activeTabData.colorKeys.length > 0 && (
            <div className="flex flex-wrap gap-8">
              {activeTabData.colorKeys.map(colorKey => (
                <div key={colorKey} className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{COLOR_LABELS[colorKey]}</h3>
                  <div className="flex flex-wrap gap-1.5 max-w-sm">
                    <button 
                      onClick={() => handleOptionChange(colorKey, '')}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-transform hover:scale-110 ${!options[colorKey] || options[colorKey].length === 0 ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm' : 'border-slate-300 bg-white'}`}
                      title="Auto (Random)"
                    >
                      <span className="text-[10px] text-slate-500">Auto</span>
                    </button>
                    {COLORS[colorKey].map(color => (
                      <button
                        key={color}
                        onClick={() => handleOptionChange(colorKey, color)}
                        className={`w-7 h-7 rounded-full border transition-all hover:scale-110 flex items-center justify-center ${options[colorKey]?.[0] === color ? 'border-indigo-600 ring-2 ring-indigo-600/20 scale-110 shadow-sm' : 'border-slate-200 shadow-sm'}`}
                        style={{ backgroundColor: color === 'transparent' ? '#ffffff' : `#${color}` }}
                        title={`#${color}`}
                      >
                        {color === 'transparent' && <span className="text-[14px] text-slate-300 font-bold block rotate-45">/</span>}
                        {options[colorKey]?.[0] === color && color !== 'transparent' && (
                          <Check size={12} className={['ffffff', 'e6e6e6', 'ffdfbf'].includes(color) ? 'text-slate-900' : 'text-white'} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Visual Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedOptions.map(optValue => {
              const isActive = (options[activeTabData.id]?.[0] || 'auto') === optValue || (optValue === 'none' && options[activeTabData.id]?.[0] === 'none');
              
              const thumbOpts = { ...options };
              thumbOpts[activeTabData.id] = [optValue];
              const payload = getPayloadFromOptions(thumbOpts);
              payload.size = 128; 
              
              const thumbSvg = createAvatar(avataaars, payload).toString();

              return (
                <button
                  key={optValue}
                  onClick={() => handleOptionChange(activeTabData.id, optValue)}
                  className={`relative aspect-square rounded-2xl border bg-white flex flex-col items-center justify-center p-2 transition-all hover:shadow-md hover:border-slate-300 group ${isActive ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm' : 'border-slate-200'}`}
                >
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: thumbSvg }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-medium text-slate-500 bg-white/90 backdrop-blur-sm py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity capitalize">
                    {optValue === 'none' ? 'None' : optValue.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
