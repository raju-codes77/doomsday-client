import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import logoImg from '../assets/logo.jpg';
import { CalendarIcon, ArrowRightIcon, CheckIcon, ClockIcon } from './Icons';
import GlassSelect from './GlassSelect';

export default function RewatchPlan({
  targetOptions = [],
  selectedTargetMovieId,
  onSelectTargetMovie,
  planItems = [],
  onTogglePlanItem,
  onPlanReady,
  targetMovieTitle = 'Avengers: Doomsday',
}) {
  const doneCount = planItems.filter((p) => p.watched).length;
  const totalCount = planItems.length;
  const remainingCount = totalCount - doneCount;

  const remainingMins = planItems
    .filter((p) => !p.watched)
    .reduce((sum, p) => sum + (p.min || 0), 0);

  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;
  const hours = Math.floor(remainingMins / 60);
  const minutes = String(remainingMins % 60).padStart(2, '0');
  const formattedTime = `${hours}h ${minutes}m`;

  const totalTimeRef = useRef(null);
  const stateRef = useRef({ mins: remainingMins });
  const isFirstRef = useRef(true);

  useEffect(() => {
    const first = isFirstRef.current;
    isFirstRef.current = false;

    const barEl = document.querySelector('#bar');
    // 1. Progress bar width animation
    if (barEl) {
      gsap.to(barEl, {
        width: pct + '%',
        duration: first ? 1.2 : 0.6,
        ease: 'power3.out',
        delay: first ? 0.6 : 0,
      });
    }

    // 2. Remaining minutes number ticker animation
    gsap.to(stateRef.current, {
      mins: remainingMins,
      duration: first ? 1.2 : 0.6,
      delay: first ? 0.6 : 0,
      ease: 'power2.out',
      onUpdate: () => {
        if (totalTimeRef.current) {
          const t = Math.round(stateRef.current.mins);
          const h = Math.floor(t / 60);
          const m = String(t % 60).padStart(2, '0');
          totalTimeRef.current.textContent = `${h}h ${m}m`;
        }
      },
    });
  }, [remainingMins, pct, formattedTime]);

  const selectOptions =
    targetOptions.length > 0
      ? targetOptions.map((t) => ({ value: t.id, label: t.title }))
      : [{ value: '', label: targetMovieTitle }];

  return (
    <div id="plan" className="panel glass rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarIcon className="w-8 h-8 text-vio-400" />
        <div>
          <h2 className="text-[15px] font-semibold leading-tight text-white">Rewatch Plan</h2>
          <p className="text-[11px] text-white/60 mt-0.5">
            See what to watch before <span className="text-vio-300 font-medium">{targetMovieTitle}</span>
          </p>
        </div>
      </div>

      {/* Target Movie Selector */}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-[12px] text-white/90 whitespace-nowrap font-medium">Target Movie</span>
        <div className="relative flex-1">
          <GlassSelect
            value={selectedTargetMovieId}
            onChange={(val) => onSelectTargetMovie(val)}
            options={selectOptions}
            icon={<img src={logoImg} alt="Logo" className="w-5 h-5 rounded-md object-cover shadow-sm" />}
            rounded="rounded-full"
            height="h-[38px]"
          />
        </div>
        <button
          aria-label="Ready plan"
          onClick={() => onPlanReady(totalTimeRef.current ? totalTimeRef.current.textContent : formattedTime)}
          className="btn-grad w-[42px] h-[38px] rounded-full grid place-items-center text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Stats */}
      <div className="mt-4 flex justify-between text-[11px] text-white/90 font-medium">
        <span id="watchedText">
          {doneCount} of {totalCount} watched
        </span>
        <span id="remainingText">{remainingCount} remaining</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div id="bar" className="progress-fill h-full rounded-full" style={{ width: `${pct}%` }} />
      </div>

      {/* Checklist & Total Watch Time */}
      <div className="mt-4 flex gap-3">
        <ul id="planList" className="flex-1 flex flex-col gap-[7px] text-[11px] max-h-[220px] overflow-y-auto pr-1">
          {planItems.length === 0 ? (
            <li className="text-white/40 italic py-4 text-center">
              No prerequisites required for this movie!
            </li>
          ) : (
            planItems.map((p, idx) => (
              <li
                key={p.id || idx}
                onClick={() => onTogglePlanItem(p)}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <span
                  className={`w-[17px] h-[17px] rounded-full grid place-items-center shrink-0 transition-all ${
                    p.watched
                      ? 'bg-vio-500 text-white shadow-[0_0_8px_rgba(139,60,240,0.6)]'
                      : 'border border-white/40 group-hover:border-white/70'
                  }`}
                >
                  {p.watched && (
                    <span className="w-3 h-3 flex items-center justify-center">
                      <CheckIcon className="w-3 h-3" />
                    </span>
                  )}
                </span>
                <span
                  className={`flex-1 transition-colors truncate ${
                    p.watched ? 'text-white font-medium line-through opacity-70' : 'text-white/85 group-hover:text-white'
                  }`}
                >
                  {p.title}
                </span>
                <span className="text-white/35 shrink-0">({p.min} min)</span>
              </li>
            ))
          )}
        </ul>

        <div className="w-[118px] shrink-0 rounded-xl border border-line bg-white/[.04] flex flex-col items-center justify-center text-center px-2 py-3">
          <ClockIcon className="w-6 h-6 text-vio-400" />
          <p className="mt-2 text-[10.5px] text-white/90 leading-tight">
            Total Watch Time
            <br />
            <span className="text-white/55">(Remaining)</span>
          </p>
          <p
            ref={totalTimeRef}
            id="totalTime"
            className="mt-4 text-[22px] font-bold leading-none text-white tracking-tight"
          >
            {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
}
