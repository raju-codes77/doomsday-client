import { useEffect, useRef, useCallback } from 'react';
import { XIcon, CheckIcon, PlusIcon, ClockIcon, ClapperIcon, ArrowRightIcon } from './Icons';

export default function MovieInfoModal({
  movie,
  isOpen,
  onClose,
  onToggleWatched,
  onSetAsTarget,
}) {
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
        gsap.fromTo(
          boxRef.current,
          { y: 30, scale: 0.94, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' }
        );
      }
    }
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const hours = movie.min ? Math.floor(movie.min / 60) : 0;
  const minutes = movie.min ? movie.min % 60 : 0;
  const formattedRuntime = movie.min ? `${movie.min} min (${hours}h ${minutes}m)` : 'Unknown';

  const hasPrereqs = movie.prerequisites && movie.prerequisites.length > 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#0e0822]/95 backdrop-blur-2xl shadow-[0_0_90px_rgba(139,60,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.15)] my-6"
      >
        {/* Background Ambient Poster Glow */}
        {movie.poster && (
          <div
            className="absolute inset-x-0 top-0 h-44 opacity-25 filter blur-2xl pointer-events-none"
            style={{
              backgroundImage: `url("${movie.poster}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 border border-white/20 hover:bg-white/20 text-white/80 hover:text-white grid place-items-center transition-all cursor-pointer shadow-md"
        >
          <XIcon className="w-4 h-4" />
        </button>

        <div className="relative z-10 p-6 sm:p-7">
          {/* Main Info Header: Poster + Title + Chips */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Movie Poster */}
            <div className="shrink-0 w-[120px] h-[165px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#140e2e] relative group">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full grid place-items-center text-center p-2"
                  style={{
                    backgroundImage: `linear-gradient(160deg, ${movie.c?.[0] || '#1e1b4b'}, ${movie.c?.[1] || '#6d28d9'})`,
                  }}
                >
                  <ClapperIcon className="w-8 h-8 text-white/50" />
                </div>
              )}

              {/* Watched Badge on Poster */}
              <div
                className={`absolute bottom-2 inset-x-2 py-1 rounded-lg text-[10px] font-semibold text-center backdrop-blur-md shadow-md ${
                  movie.watched
                    ? 'bg-emerald-500/85 text-white'
                    : 'bg-black/70 text-white/80 border border-white/20'
                }`}
              >
                {movie.watched ? '✓ Watched' : 'Unwatched'}
              </div>
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-vio-400">
                MCU Film Details
              </span>
              <h2 className="text-[22px] sm:text-[24px] font-bold text-white leading-tight mt-1">
                {movie.title}
              </h2>

              {/* Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-[11.5px]">
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-medium text-white/90">
                  {movie.year}
                </span>

                <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-medium text-white/90 flex items-center gap-1.5">
                  <ClockIcon className="w-3.5 h-3.5 text-vio-400" />
                  {formattedRuntime}
                </span>

                <span
                  className={`rounded-full px-3 py-1 font-semibold flex items-center gap-1.5 ${
                    movie.watched
                      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                      : 'border border-amber-500/40 bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {movie.watched ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5" /> Watched
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-3.5 h-3.5" /> Up Next
                    </>
                  )}
                </span>
              </div>

              {/* Quick Summary / Status */}
              <p className="mt-3 text-[12.5px] text-white/70 leading-snug">
                {movie.watched
                  ? 'You have already watched this film! It is marked as completed in your rewatch progress.'
                  : 'You have not watched this movie yet. Mark it as watched once you finish viewing.'}
              </p>
            </div>
          </div>

          {/* Prerequisites Section */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-[13px] font-semibold text-white/95 flex items-center gap-2">
                <ClapperIcon className="w-4 h-4 text-vio-400" />
                Required Prerequisites
              </h4>
              <span className="text-[11px] text-white/50">
                {hasPrereqs ? `${movie.prerequisites.length} prerequisite(s)` : 'None'}
              </span>
            </div>

            {hasPrereqs ? (
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {movie.prerequisites.map((prereq, idx) => {
                  const title = typeof prereq === 'object' ? prereq.title : `Movie ID: ${prereq}`;
                  const year = typeof prereq === 'object' ? prereq.releaseYear : null;
                  const min = typeof prereq === 'object' ? prereq.runtime : null;
                  const watched = typeof prereq === 'object' ? prereq.watched : null;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/8 bg-white/[0.03] text-[12px]"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-vio-400 shrink-0" />
                        <span className="truncate text-white font-medium">{title}</span>
                        {year && <span className="text-white/45 text-[11px]">({year})</span>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {min && <span className="text-white/40 text-[11px]">{min} min</span>}
                        {watched !== null && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              watched
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-white/10 text-white/60'
                            }`}
                          >
                            {watched ? 'Watched' : 'Pending'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/12 bg-white/[0.02] p-3 text-[12px] text-white/60 text-center">
                ✨ Standalone MCU viewing — no direct prerequisites required before this film.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onToggleWatched(movie.id)}
              className={`h-[38px] px-4 rounded-full text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                movie.watched
                  ? 'border border-line bg-white/[0.05] hover:bg-white/10 text-white/90'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              }`}
            >
              {movie.watched ? (
                <>Mark as Unwatched</>
              ) : (
                <>
                  <CheckIcon className="w-3.5 h-3.5" /> Mark as Watched
                </>
              )}
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onSetAsTarget(movie.id);
                  handleClose();
                }}
                className="btn-grad h-[38px] px-4 rounded-full text-[12px] font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-[0_0_18px_rgba(139,60,240,0.4)]"
              >
                Plan Rewatch <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="h-[38px] px-4 rounded-full text-[12px] font-semibold border border-white/15 hover:bg-white/10 text-white/80 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
