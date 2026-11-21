import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ClapperIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, CheckIcon, XIcon } from './Icons';

export default function MoviesSection({
  movies,
  onToggleMovie,
  onRemoveMovie,
  onOpenAddMovie,
  onSelectMovie,
  searchTerm = '',
  hasPrequels = false,
  targetMovieTitle = '',
}) {
  const trackRef = useRef(null);
  const [displayedList, setDisplayedList] = useState(movies);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const prevIdsRef = useRef(movies.map((m) => m.id).join(','));

  const checkScrollEdges = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    checkScrollEdges();
    const el = trackRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollEdges);
      window.addEventListener('resize', checkScrollEdges);
      return () => {
        el.removeEventListener('scroll', checkScrollEdges);
        window.removeEventListener('resize', checkScrollEdges);
      };
    }
  }, [displayedList]);

  // Senior UI/UX 3D Cinematic Deal & Ripple Transition using GSAP
  useEffect(() => {
    const currentIds = movies.map((m) => m.id).join(',');

    // If only attributes changed (e.g. watched toggle), sync smoothly without full shuffle
    if (prevIdsRef.current === currentIds) {
      setDisplayedList(movies);
      return;
    }

    prevIdsRef.current = currentIds;

    const cards = document.querySelectorAll('.movie-card');
    if (cards.length === 0) {
      setDisplayedList(movies);
      return;
    }

    // Step 1: Smooth sweep out of existing cards (160ms)
    gsap.killTweensOf(cards);
    gsap.to(cards, {
      opacity: 0,
      y: -12,
      scale: 0.94,
      duration: 0.16,
      stagger: 0.015,
      ease: 'power2.in',
      onComplete: () => {
        // Step 2: Instant swap while hidden & reset track scrollbar
        if (trackRef.current) trackRef.current.scrollLeft = 0;
        setDisplayedList(movies);

        // Step 3: Animate badge in header if rewatch path
        const badge = document.querySelector('#movies-order-badge');
        if (badge) {
          gsap.fromTo(badge, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' });
        }

        // Step 4: Cinematic 3D Card Deal & Ripple Reveal
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const newCards = document.querySelectorAll('.movie-card');
            if (newCards.length > 0) {
              gsap.fromTo(
                newCards,
                {
                  opacity: 0,
                  y: 32,
                  scale: 0.88,
                  rotateY: (i) => (i % 2 === 0 ? -12 : 12),
                  transformOrigin: '50% 100%',
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  rotateY: 0,
                  duration: 0.65,
                  stagger: {
                    each: 0.05,
                    ease: 'power1.out',
                  },
                  ease: 'back.out(1.4)',
                  clearProps: 'transform,opacity',
                  onComplete: checkScrollEdges,
                }
              );
            }
          });
        });
      },
    });
  }, [movies]);

  // GSAP smooth scroll
  const scrollBy = (offset) => {
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        scrollLeft: trackRef.current.scrollLeft + offset,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: checkScrollEdges,
        onComplete: checkScrollEdges,
      });
    }
  };

  // GSAP toggle bounce animation
  const handleToggle = (id) => {
    onToggleMovie(id);
    requestAnimationFrame(() => {
      const btn = document.querySelector(`.tog[data-id="${id}"]`);
      if (btn) {
        gsap.fromTo(btn, { scale: 0.4 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' });
      }
    });
  };

  const filteredMovies = displayedList.filter((m) => {
    const q = searchTerm.toLowerCase();
    return (
      (m.short && m.short.toLowerCase().includes(q)) ||
      (m.title && m.title.toLowerCase().includes(q))
    );
  });

  const fmt = (m) => (m.min ? `${m.min} min` : '? min');

  return (
    <div id="movies" className="panel glass rounded-2xl p-5 relative transition-shadow duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <ClapperIcon className="w-8 h-8 text-vio-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[15px] font-semibold leading-tight text-white">Your Movies</h2>
              {hasPrequels && (
                <span
                  id="movies-order-badge"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-vio-500/15 border border-vio-400/30 text-vio-300 shadow-[0_0_12px_rgba(139,60,240,0.25)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Rewatch Order
                </span>
              )}
            </div>
            <p className="text-[11px] text-white/60 mt-0.5">
              {hasPrequels
                ? `Sequential viewing path for ${targetMovieTitle} (${displayedList.length} films)`
                : 'Manage your MCU movie collection'}
            </p>
          </div>
        </div>

        <button
          id="addMovie"
          onClick={onOpenAddMovie}
          className="btn-grad flex items-center gap-1.5 h-[34px] px-4 rounded-full text-[11px] font-semibold text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md shrink-0"
        >
          <PlusIcon className="w-3.5 h-3.5" /> Add Movie
        </button>
      </div>

      {/* Carousel */}
      <div className="relative mt-4">
        {/* Prev button */}
        <button
          id="prev"
          aria-label="Previous"
          onClick={() => scrollBy(-250)}
          style={{ opacity: canScrollLeft ? 1 : 0.35 }}
          className="absolute -left-[31px] top-1/2 -translate-y-1/2 z-10 w-[34px] h-[34px] rounded-full border border-white/12 bg-[#14102a]/80 backdrop-blur-md grid place-items-center hover:bg-vio-600 hover:border-vio-400 hover:shadow-[0_0_15px_rgba(139,60,240,0.5)] transition-all text-white cursor-pointer shadow-lg"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Next button */}
        <button
          id="next"
          aria-label="Next"
          onClick={() => scrollBy(250)}
          style={{ opacity: canScrollRight ? 1 : 0.35 }}
          className="absolute -right-[31px] top-1/2 -translate-y-1/2 z-10 w-[34px] h-[34px] rounded-full border border-white/12 bg-[#14102a]/80 backdrop-blur-md grid place-items-center hover:bg-vio-600 hover:border-vio-400 hover:shadow-[0_0_15px_rgba(139,60,240,0.5)] transition-all text-white cursor-pointer shadow-lg"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>

        {/* Track with 3D Perspective */}
        <div
          id="track"
          ref={trackRef}
          className="no-scrollbar flex gap-[14px] overflow-x-auto py-1"
          style={{ perspective: '1200px' }}
        >
          {filteredMovies.length === 0 ? (
            <div className="w-full text-center py-8 text-white/50 text-[12px] italic">
              No movies match your search.
            </div>
          ) : (
            filteredMovies.map((m, idx) => {
              const bgStyle = m.poster
                ? {
                    backgroundImage: `url("${m.poster}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {
                    backgroundImage: `linear-gradient(160deg, ${m.c ? m.c[0] : '#1e1b4b'}, ${
                      m.c ? m.c[1] : '#6d28d9'
                    })`,
                  };

              const isTargetFilm = m.isTarget || m.title === targetMovieTitle;

              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMovie && onSelectMovie(m)}
                  className={`movie-card group shrink-0 w-[110px] rounded-xl border bg-[#0b0818] overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 relative ${
                    isTargetFilm
                      ? 'border-vio-400/90 shadow-[0_0_24px_rgba(139,60,240,0.55)]'
                      : 'border-line hover:border-vio-400/80 hover:shadow-[0_0_20px_rgba(139,60,240,0.35)]'
                  }`}
                >
                  {/* Step Number or Target Badge */}
                  {hasPrequels ? (
                    isTargetFilm ? (
                      <div className="absolute top-1.5 left-1.5 z-20 px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 text-[8.5px] font-extrabold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(168,85,247,0.6)] border border-violet-400/40">
                        Target
                      </div>
                    ) : (
                      <div className="absolute top-1.5 left-1.5 z-20 px-1.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/25 text-[9px] font-bold tracking-tight text-white/90 shadow-sm">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    )
                  ) : (
                    isTargetFilm && (
                      <div className="absolute top-1.5 left-1.5 z-20 px-1.5 py-0.5 rounded-md bg-vio-600 text-[8.5px] font-bold uppercase tracking-wider text-white shadow-md">
                        Target
                      </div>
                    )
                  )}

                  <div className="relative h-[145px] img-slot" style={bgStyle}>
                    {/* Watched toggle button */}
                    <button
                      data-id={m.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(m.id);
                      }}
                      className={`tog absolute top-1.5 right-1.5 w-[22px] h-[22px] rounded-full grid place-items-center transition-colors cursor-pointer z-20 ${
                        m.watched
                          ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.55)]'
                          : 'bg-black/50 border border-white/70 text-white hover:bg-vio-600'
                      }`}
                      aria-label={`Toggle ${m.title} watched`}
                    >
                      <span className="w-3.5 h-3.5 flex items-center justify-center">
                        {m.watched ? <CheckIcon className="w-3.5 h-3.5" /> : <PlusIcon className="w-3.5 h-3.5" />}
                      </span>
                    </button>

                    {/* Remove movie button */}
                    {!m.isTarget && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveMovie(m.id);
                        }}
                        className={`rm absolute bottom-1.5 right-1.5 w-[22px] h-[22px] rounded-full bg-black/60 text-white/90 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-red-600 grid place-items-center transition-opacity cursor-pointer z-20`}
                        aria-label={`Remove ${m.title}`}
                      >
                        <span className="w-3 h-3 flex items-center justify-center">
                          <XIcon className="w-3 h-3" />
                        </span>
                      </button>
                    )}
                  </div>

                  <div className="px-1.5 py-2 text-center h-[58px] flex flex-col justify-center">
                    <p
                      className="text-[11px] font-semibold leading-tight text-white whitespace-nowrap overflow-hidden text-ellipsis"
                      title={m.title}
                    >
                      {m.title}
                    </p>
                    <p className="text-[10px] text-white/55 mt-1 whitespace-nowrap">
                      {m.year} • {fmt(m)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
