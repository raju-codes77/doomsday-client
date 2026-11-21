import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from './Icons';

export default function GlassSelect({
  value,
  onChange,
  options = [],
  icon = null,
  className = '',
  dropdownClassName = '',
  rounded = 'rounded-xl',
  height = 'h-[44px]',
  placeholder = 'Select option...',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);

  // Normalize options to { value, label }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value, label: opt.label ?? String(opt.value) };
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || normalizedOptions[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const gsap = window.gsap;
      if (gsap) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -6, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
        );
      }
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative w-full select-none ${isOpen ? 'z-40' : 'z-10'}`}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`glass-select group flex items-center justify-between w-full ${height} ${rounded} px-3.5 text-left text-white transition-all cursor-pointer ${
          isOpen ? 'ring-2 ring-vio-500/35 border-vio-400/80 shadow-[0_0_22px_rgba(139,60,240,0.3)]' : ''
        } ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          {icon && (
            <span className="shrink-0 w-5 h-5 flex items-center justify-center text-vio-400 group-hover:scale-105 transition-transform">
              {icon}
            </span>
          )}
          <span className="truncate text-[12.5px] font-medium text-white/95">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <span
          className={`shrink-0 w-4 h-4 text-white/60 group-hover:text-white transition-transform duration-200 flex items-center justify-center ${
            isOpen ? 'rotate-180 text-vio-400' : ''
          }`}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </button>

      {/* Glass Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          className={`absolute left-0 right-0 top-full mt-2 z-50 max-h-[240px] overflow-y-auto rounded-2xl border border-white/15 bg-[#0e0822]/90 backdrop-blur-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(139,60,240,0.18)] ${dropdownClassName}`}
        >
          <div className="flex flex-col gap-1">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full rounded-xl px-3 py-2 text-[12.5px] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-vio-600/50 to-vio-500/35 text-white font-semibold border border-vio-400/30 shadow-[0_0_12px_rgba(139,60,240,0.25)]'
                      : 'text-white/80 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="w-4 h-4 shrink-0 text-vio-300 flex items-center justify-center ml-2">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
