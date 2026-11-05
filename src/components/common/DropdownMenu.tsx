import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'warning';
}

interface DropdownMenuProps {
  items: DropdownItem[];
  id?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef} id={id}>
      <button
        type="button"
        id={`${id || 'dropdown'}-trigger`}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
        aria-label="Ações rápidas"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          id={`${id || 'dropdown'}-menu`}
          className="absolute right-0 z-40 mt-1 w-48 origin-top-right rounded-xl bg-slate-900 shadow-2xl ring-1 ring-black/20 border border-slate-800 py-1 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              id={`${id || 'dropdown'}-item-${idx}`}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${
                item.variant === 'danger'
                  ? 'text-rose-400 hover:bg-rose-500/10'
                  : item.variant === 'warning'
                  ? 'text-amber-400 hover:bg-amber-500/10'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-emerald-400'
              }`}
            >
              {item.icon && <span className="h-4 w-4">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
