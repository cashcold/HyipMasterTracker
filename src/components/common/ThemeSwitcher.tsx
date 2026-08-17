import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme, AppTheme } from '../../context/ThemeContext.tsx';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: AppTheme; label: string; icon: React.ReactNode; previewBg: string; text: string }[] = [
    {
      id: 'classic-light',
      label: 'Classic Light',
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      previewBg: 'bg-[#ebedf0]',
      text: 'Original High-Trust Directory',
    },
    {
      id: 'midnight-dark',
      label: 'Midnight Dark',
      icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
      previewBg: 'bg-[#090d16]',
      text: 'Eye-Safe Low-Light Canvas',
    },
    {
      id: 'navy-slate',
      label: 'Navy Slate',
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />,
      previewBg: 'bg-[#0f172a]',
      text: 'High-Contrast Pro Investor',
    },
  ];

  const currentThemeObj = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[#334155] font-bold transition-all shadow-xs cursor-pointer"
        title="Switch color theme"
      >
        {currentThemeObj.icon}
        <span className="hidden sm:inline text-[11px]">{currentThemeObj.label}</span>
        <Palette className="w-3 h-3 text-[#64748b]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 bg-white border border-[#cbd5e1] rounded-lg shadow-2xl z-50 p-1.5 space-y-1 text-xs">
          <div className="px-2 py-1 text-[10px] font-bold text-[#64748b] uppercase tracking-wider border-b border-[#e2e8f0]">
            Select Display Theme (3 Styles)
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                setIsOpen(false);
              }}
              className={`w-full p-2 rounded-md text-left flex items-center justify-between transition-colors cursor-pointer ${
                theme === t.id ? 'bg-[#f1f5f9] text-[#1e293b] font-bold' : 'hover:bg-[#f8fafc] text-[#475569]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[#e2e8f0]">
                  {t.icon}
                </div>
                <div>
                  <span className="block text-xs font-bold leading-tight">{t.label}</span>
                  <span className="block text-[9px] text-[#64748b] leading-tight">{t.text}</span>
                </div>
              </div>
              {theme === t.id && <Check className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
