import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckIcon, XIcon } from './Icons';

function ToastItem({ toast, onClose }) {
  const itemRef = useRef(null);
  const progressRef = useRef(null);
  const tlRef = useRef(null);
  const isExitingRef = useRef(false);

  const handleDismiss = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    if (itemRef.current) {
      gsap.to(itemRef.current, {
        opacity: 0,
        x: 30,
        scale: 0.94,
        duration: 0.28,
        ease: 'power2.in',
        force3D: true,
        onComplete: () => {
          onClose?.(toast.id);
        },
      });
    } else {
      onClose?.(toast.id);
    }
  };

  useEffect(() => {
    if (!itemRef.current) return;

    const ctx = gsap.context(() => {
      // Hardware-accelerated smooth initial position
      gsap.set(itemRef.current, {
        opacity: 0,
        x: 40,
        scale: 0.92,
        transformOrigin: 'bottom right',
        force3D: true,
      });

      const tl = gsap.timeline({
        onComplete: () => {
          handleDismiss();
        },
      });
      tlRef.current = tl;

      // Enter smoothly
      tl.to(itemRef.current, {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.38,
        ease: 'power3.out',
      });

      // Progress bar timing
      if (progressRef.current) {
        tl.fromTo(
          progressRef.current,
          { width: '100%' },
          { width: '0%', duration: 3.2, ease: 'linear' },
          '-=0.1'
        );
      }
    }, itemRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleMouseEnter = () => {
    if (tlRef.current && !isExitingRef.current) {
      tlRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    if (tlRef.current && !isExitingRef.current) {
      tlRef.current.play();
    }
  };

  const isOk = toast.ok ?? true;

  return (
    <div
      ref={itemRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform, opacity' }}
      className={`relative overflow-hidden flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] text-white shadow-2xl pointer-events-auto backdrop-blur-xl select-none ${
        isOk
          ? 'bg-[#0f0b24]/92 border border-emerald-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.15)]'
          : 'bg-[#180a1c]/92 border border-rose-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.5),0_0_20px_rgba(244,63,94,0.15)]'
      }`}
    >
      {/* Icon badge */}
      <span
        className={`w-5 h-5 rounded-full grid place-items-center shrink-0 shadow-sm ${
          isOk
            ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
            : 'bg-gradient-to-tr from-rose-600 to-red-400 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
        }`}
      >
        <span className="w-3 h-3 flex items-center justify-center">
          {isOk ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
        </span>
      </span>

      {/* Message */}
      <span className="font-medium tracking-wide text-white/95 pr-2 max-w-[280px] truncate">
        {toast.msg}
      </span>

      {/* Manual close button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="text-white/40 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors ml-auto cursor-pointer"
        aria-label="Close notification"
      >
        <XIcon className="w-3 h-3" />
      </button>

      {/* Bottom animated progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
        <div
          ref={progressRef}
          className={`h-full ${
            isOk
              ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500'
              : 'bg-gradient-to-r from-rose-400 via-pink-400 to-rose-600'
          }`}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default function Toast({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none items-end max-w-sm"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}
