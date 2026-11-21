import { useEffect, useRef, useCallback } from 'react';
import { XIcon } from './Icons';

export default function Modal({ title, isOpen, onClose, children, actions = [] }) {
  const overlayRef = useRef(null);
  const boxRef = useRef(null);

  const handleClose = useCallback(() => {
    const gsap = window.gsap;
    if (gsap && overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      const gsap = window.gsap;
      if (gsap && overlayRef.current) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      }
      if (gsap && boxRef.current) {
        gsap.fromTo(boxRef.current, { y: 24, scale: 0.96 }, { y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-white/12 bg-[#0e0a1c]/90 backdrop-blur-2xl p-6 shadow-[0_0_80px_rgba(124,45,224,.35),inset_0_1px_1px_rgba(255,255,255,0.12)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-semibold text-white">{title}</h3>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full hover:bg-white/10 grid place-items-center text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[13px] text-white/80 leading-relaxed">{children}</div>

        {actions.length > 0 && (
          <div className="mt-6 flex justify-end gap-3">
            {actions.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (a.onClick) {
                    const result = a.onClick();
                    if (result !== false) handleClose();
                  } else {
                    handleClose();
                  }
                }}
                className={`${
                  a.primary
                    ? 'btn-grad text-white'
                    : 'border border-line hover:bg-white/10 text-white/90'
                } h-[38px] px-5 rounded-full text-[12.5px] font-semibold cursor-pointer transition-all`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
