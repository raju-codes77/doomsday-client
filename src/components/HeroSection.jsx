import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import logoImg from '../assets/logo.jpg';
import { SearchIcon, ArrowRightIcon, XIcon, MenuIcon } from './Icons';

const splitTitle = (title = '') => {
  if (!title) return { prefix: '', highlight: 'Doomsday' };
  const colonIndex = title.indexOf(':');
  if (colonIndex !== -1) {
    return {
      prefix: title.slice(0, colonIndex + 1) + ' ',
      highlight: title.slice(colonIndex + 1).trim(),
    };
  }
  return { prefix: '', highlight: title };
};

export default function HeroSection({
  targetMovie,
  prequelCount = 0,
  searchTerm,
  setSearchTerm,
  onOpenLearnMore,
  onScrollTo,
  onToggleMobileMenu,
}) {
  const searchInputRef = useRef(null);
  const heroTextRef = useRef(null);

  const { prefix, highlight } = splitTitle(targetMovie?.title || 'Avengers: Doomsday');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // GSAP Smooth Transition when target movie changes
  useEffect(() => {
    if (!heroTextRef.current) return;

    gsap.fromTo(
      heroTextRef.current,
      { y: 18, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', clearProps: 'transform' }
    );
  }, [targetMovie?.id]);

  return (
    <>
      {/* Top bar */}
      <header id="topbar" className="relative z-20 flex items-center justify-between gap-3 pt-5">
        {/* Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-2 lg:hidden shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/10 text-white/90 hover:text-white shadow-[0_0_15px_rgba(139,60,240,0.25)] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Open menu"
          >
            <MenuIcon className="w-5 h-5 text-vio-400" />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <img
              src={logoImg}
              alt="Logo"
              className="w-8 h-8 rounded-lg object-cover shadow-[0_0_12px_rgba(139,60,240,0.5)] border border-white/20"
            />
            <span className="font-bold text-[14px] tracking-tight text-white hidden sm:inline">
              Doomsday<span className="text-vio-400">Ready</span>
            </span>
          </div>
        </div>

        <label className="glass-search flex items-center gap-3 w-full max-w-[440px] h-[44px] rounded-full px-4 text-white/70 text-[13px] transition-all">
          <span className="w-5 h-5 shrink-0 flex items-center justify-center text-vio-400/80">
            <SearchIcon className="w-5 h-5" />
          </span>
          <input
            id="search"
            ref={searchInputRef}
            type="text"
            placeholder="Search movies by title, year..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-white/40 text-white text-[13px]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                searchInputRef.current?.focus();
              }}
              className="w-5 h-5 rounded-full hover:bg-white/10 grid place-items-center text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Clear search"
            >
              <XIcon className="w-3 h-3" />
            </button>
          )}
          <kbd className="rounded-md border border-white/15 bg-white/[0.08] backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-white/75 select-none shadow-sm">
            Ctrl + K
          </kbd>
        </label>
      </header>

      {/* Hero text */}
      <section className="mt-10 max-w-[580px]" id="hero">
        <div ref={heroTextRef} id="hero-content">
          <p className="hero-in text-[19px] font-semibold text-vio-400">
            {targetMovie?.title ? `${targetMovie.title} Rewatch` : 'Doomsday Ready'}
          </p>
          <h1 className="hero-in mt-2 text-[44px] sm:text-[48px] leading-[1.02] font-extrabold italic tracking-tight text-white">
            Prepare for<br />
            {prefix}
            <span className="title-grad">{highlight}</span>
          </h1>
          <p className="hero-in mt-4 text-[17px] leading-snug text-white/95 max-w-[440px]">
            {prequelCount > 0
              ? `Watch all ${prequelCount} prerequisite films in timeline order before viewing ${targetMovie?.title}!`
              : `Plan your MCU rewatch and book your opening night watch party for ${targetMovie?.title || 'Avengers: Doomsday'}!`}
          </p>
        </div>

        <div className="hero-in mt-5 flex items-center gap-4">
          <a
            href="#movies"
            onClick={(e) => {
              e.preventDefault();
              onScrollTo('#movies');
            }}
            className="btn-grad inline-flex items-center gap-2.5 h-[41px] px-7 rounded-full text-[13px] font-semibold text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_22px_rgba(147,51,234,.45)]"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M7 4v16l13-8z" />
            </svg>
            Get Started
          </a>
          <button
            type="button"
            onClick={onOpenLearnMore}
            className="inline-flex items-center gap-2 h-[41px] px-7 rounded-full text-[13px] font-medium border border-white/40 bg-black/20 hover:bg-white/10 transition-colors text-white cursor-pointer"
          >
            Learn More <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </section>
    </>
  );
}
