import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import MoviesSection from './components/MoviesSection';
import RewatchPlan from './components/RewatchPlan';
import BookingSection from './components/BookingSection';
import Modal from './components/Modal';
import MovieInfoModal from './components/MovieInfoModal';
import Toast from './components/Toast';
import GlassSelect from './components/GlassSelect';
import { ClockIcon } from './components/Icons';
import avengersHeroBg from './assets/Avengers_hero.png';
import { movieApi } from './api';

const formatMovie = (m) => ({
  id: m._id,
  title: m.title,
  short: m.title,
  year: m.releaseYear,
  min: m.runtime,
  watched: m.watched ?? false,
  poster: m.posterUrl || '',
  prerequisites: m.prerequisites || [],
  c: ['#1e1b4b', '#6d28d9'],
  isTarget: m.title.toLowerCase().includes('doomsday'),
});

export default function App() {
  const mainRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [plan, setPlan] = useState([]);
  const [selectedTargetMovieId, setSelectedTargetMovieId] = useState('');
  const [targetMovieTitle, setTargetMovieTitle] = useState('Avengers: Doomsday');
  const [activeMovieInfo, setActiveMovieInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('movies');
  const [loading, setLoading] = useState(true);

  // GSAP Intro Timeline
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (document.querySelector('#sidebar')) {
        tl.fromTo('#sidebar', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 });
      }
      if (document.querySelector('#topbar')) {
        tl.fromTo('#topbar', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=.4');
      }
      if (document.querySelectorAll('.hero-in').length > 0) {
        tl.fromTo('.hero-in', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 }, '-=.3');
      }
      if (document.querySelectorAll('.panel').length > 0) {
        tl.fromTo('.panel', { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 }, '-=.4');
      }
    });

    return () => ctx.revert();
  }, []);

  // Toast system
  const [toasts, setToasts] = useState([]);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((msg, ok = true) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => {
      // Limit to 4 toasts max to avoid layout clutter
      const trimmed = prev.length >= 4 ? prev.slice(prev.length - 3) : prev;
      return [...trimmed, { id, msg, ok }];
    });
  }, []);

  // Modals state
  const [modalState, setModalState] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Add Movie Form State
  const [addTitle, setAddTitle] = useState('');
  const [addYear, setAddYear] = useState('2026');
  const [addMin, setAddMin] = useState('140');
  const [addPoster, setAddPoster] = useState('');
  // Quote Form State
  const [quoteData, setQuoteData] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('6:00 PM');

  // Load initial movies and rewatch plan from backend
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await movieApi.getAll();
        const formatted = data.map(formatMovie);
        setMovies(formatted);

        // Find default target movie (prefer Avengers: Doomsday, or last movie)
        const doomsdayMovie =
          formatted.find((m) => m.title.toLowerCase().includes('doomsday')) ||
          formatted[formatted.length - 1];

        if (doomsdayMovie) {
          setSelectedTargetMovieId(doomsdayMovie.id);
          setTargetMovieTitle(doomsdayMovie.title);
          loadRewatchPlan(doomsdayMovie.id);
        }
      } catch (err) {
        console.error('Failed to load initial movies:', err);
        addToast('Failed to connect to backend server', false);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Helper to load rewatch plan for a target movie
  const loadRewatchPlan = async (targetId) => {
    try {
      const res = await movieApi.getRewatchOrder(targetId);
      if (res && res.movies) {
        setPlan(
          res.movies.map((m) => ({
            id: m._id,
            title: m.title,
            min: m.runtime,
            watched: m.watched ?? false,
          }))
        );
      } else {
        setPlan([]);
      }
    } catch (err) {
      console.error('Failed to load rewatch order:', err);
      setPlan([]);
    }
  };

  // Pulse glow with GSAP
  const pulse = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const gsap = window.gsap;
    if (gsap) {
      gsap.fromTo(
        el,
        { boxShadow: '0 0 0 rgba(168,85,247,0)' },
        { boxShadow: '0 0 40px rgba(168,85,247,.55)', duration: 0.5, yoyo: true, repeat: 1, clearProps: 'boxShadow' }
      );
    } else {
      el.classList.add('pulse-target');
      setTimeout(() => el.classList.remove('pulse-target'), 900);
    }
  };

  const go = (sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      pulse(sel);
    }
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    go(`#${sectionId}`);
  };

  // Scrollspy
  useEffect(() => {
    const targets = ['movies', 'plan', 'booking'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: mainRef.current, threshold: 0.4 }
    );

    targets.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Toggle movie watched status in database
  const handleToggleMovie = async (movieId) => {
    const target = movies.find((m) => m.id === movieId);
    if (!target) return;
    const newWatched = !target.watched;

    // Optimistic UI updates
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, watched: newWatched } : m))
    );
    setPlan((prev) =>
      prev.map((p) => (p.id === movieId ? { ...p, watched: newWatched } : p))
    );
    setActiveMovieInfo((prev) =>
      prev && prev.id === movieId ? { ...prev, watched: newWatched } : prev
    );

    try {
      await movieApi.update(movieId, { watched: newWatched });
      addToast(`${target.title} marked as ${newWatched ? 'watched' : 'unwatched'}`);
    } catch (err) {
      // Revert on error
      setMovies((prev) =>
        prev.map((m) => (m.id === movieId ? { ...m, watched: target.watched } : m))
      );
      setPlan((prev) =>
        prev.map((p) => (p.id === movieId ? { ...p, watched: target.watched } : p))
      );
      addToast(err.message, false);
    }
  };

  // Toggle plan item watched status in database
  const handleTogglePlanItem = async (planItem) => {
    const movieId = planItem.id;
    const newWatched = !planItem.watched;

    // Optimistic UI updates
    setPlan((prev) =>
      prev.map((p) => (p.id === movieId ? { ...p, watched: newWatched } : p))
    );
    setMovies((prev) =>
      prev.map((m) => (m.id === movieId ? { ...m, watched: newWatched } : m))
    );

    try {
      await movieApi.update(movieId, { watched: newWatched });
      addToast(`${planItem.title} marked as ${newWatched ? 'watched' : 'unwatched'}`);
    } catch (err) {
      // Revert on error
      setPlan((prev) =>
        prev.map((p) => (p.id === movieId ? { ...p, watched: planItem.watched } : p))
      );
      setMovies((prev) =>
        prev.map((m) => (m.id === movieId ? { ...m, watched: planItem.watched } : m))
      );
      addToast(err.message, false);
    }
  };

  // Remove movie from database
  const handleRemoveMovie = async (movieId) => {
    const m = movies.find((x) => x.id === movieId);
    if (!m) return;
    try {
      await movieApi.delete(movieId);
      setMovies((prev) => prev.filter((x) => x.id !== movieId));
      setPlan((prev) => prev.filter((x) => x.id !== movieId));
      addToast(`Removed ${m.title}`);
    } catch (err) {
      addToast(err.message, false);
    }
  };

  // Add Movie Submit to backend
  const handleAddMovieSubmit = async () => {
    const title = addTitle.trim();
    const min = Number(addMin);
    const year = Number(addYear) || new Date().getFullYear();
    const posterUrl = addPoster.trim() || null;

    if (!title) {
      addToast('Enter a movie title', false);
      return;
    }
    if (!(min > 0) || min > 300) {
      addToast('Runtime must be between 1 and 300 minutes', false);
      return;
    }

    try {
      const created = await movieApi.create({
        title,
        releaseYear: year,
        runtime: min,
        posterUrl,
        prerequisites: [],
        watched: false,
      });

      const formatted = formatMovie(created);
      setMovies((prev) => [...prev, formatted]);
      setModalState(null);
      setAddTitle('');
      setAddPoster('');

      // GSAP scroll carousel to end
      const track = document.getElementById('track');
      const gsap = window.gsap;
      if (gsap && track) {
        gsap.to(track, { scrollLeft: track.scrollWidth, duration: 0.7, ease: 'power2.out' });
      }
      addToast(`${title} added to database`);
    } catch (err) {
      addToast(err.message, false);
    }
  };

  // Change target movie in Rewatch Plan
  const handleSelectTargetMovie = (targetId) => {
    setSelectedTargetMovieId(targetId);
    const target = movies.find((m) => m.id === targetId);
    if (target) {
      setTargetMovieTitle(target.title);
    }
    loadRewatchPlan(targetId);
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    if (!bookingDate) {
      addToast('Pick a show date', false);
      return;
    }
    addToast(`Booked ${quoteData.groupSize} seats at ${quoteData.cinema}!`);
    setModalState(null);
  };

  // Plan ready button
  const handlePlanReady = (remainingTime) => {
    pulse('#plan');
    addToast(`Plan ready: ${remainingTime} left to watch`);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const inputClass =
    'glass-input w-full h-[42px] rounded-xl px-3.5 text-[13px] text-white placeholder:text-white/40 outline-none transition-all';

  // Find active target movie object
  const targetMovieObj = movies.find((m) => m.id === selectedTargetMovieId) || null;
  const hasPrequels = plan.length > 0;

  // Compute displayed movies for carousel (prequels sequence or all movies)
  let displayedMovies = movies;
  if (hasPrequels) {
    const planMovieMap = new Map(movies.map((m) => [String(m.id), m]));
    const prequelList = plan
      .map((p) => planMovieMap.get(String(p.id)))
      .filter(Boolean);

    // Append target movie itself at the end of the prequel sequence if not present
    if (targetMovieObj && !prequelList.some((m) => m.id === targetMovieObj.id)) {
      displayedMovies = [...prequelList, targetMovieObj];
    } else {
      displayedMovies = prequelList;
    }
  }

  // GSAP Smooth Hero Background Transition
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !selectedTargetMovieId) return;

    gsap.fromTo(
      '#img-hero',
      { opacity: 0.35, scale: 1.03 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }
    );
  }, [selectedTargetMovieId]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#07040f] text-white font-sans antialiased">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onClose={removeToast} />

      {/* ============ SIDEBAR ============ */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* ============ MAIN ============ */}
      <main
        ref={mainRef}
        className="relative flex-1 min-w-0 h-screen overflow-y-auto overflow-x-hidden [scrollbar-gutter:stable]"
      >
        {/* Hero background */}
        <div className="absolute inset-x-0 top-0 h-[360px] overflow-hidden pointer-events-none">
          <div
            id="img-hero"
            className="img-slot absolute inset-0"
            style={{
              backgroundImage: targetMovieObj?.poster
                ? `url("${targetMovieObj.poster}"), url("${avengersHeroBg}"), radial-gradient(ellipse at 75% 30%,#4c1d95 0%,#1a0b33 45%,#07040f 80%)`
                : `url("${avengersHeroBg}"), radial-gradient(ellipse at 75% 30%,#4c1d95 0%,#1a0b33 45%,#07040f 80%)`,
              backgroundPosition: 'right 20% center',
              backgroundSize: 'cover',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07040f] via-[#07040f]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07040f] to-transparent" />
        </div>

        <div className="relative z-10 px-5 sm:px-9 pb-10">
          {/* Top bar & Hero text */}
          <HeroSection
            targetMovie={targetMovieObj}
            prequelCount={plan.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenLearnMore={() => setModalState('learn-more')}
            onScrollTo={go}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
          />

          {/* Movies + Rewatch plan */}
          <section className="mt-[18px] grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_440px] gap-[14px]">
            <MoviesSection
              movies={displayedMovies}
              onToggleMovie={handleToggleMovie}
              onRemoveMovie={handleRemoveMovie}
              onOpenAddMovie={() => setModalState('add-movie')}
              onSelectMovie={(m) => setActiveMovieInfo(m)}
              searchTerm={searchTerm}
              hasPrequels={hasPrequels}
              targetMovieTitle={targetMovieTitle}
            />
            <RewatchPlan
              targetOptions={movies}
              selectedTargetMovieId={selectedTargetMovieId}
              targetMovieTitle={targetMovieTitle}
              onSelectTargetMovie={handleSelectTargetMovie}
              planItems={plan}
              onTogglePlanItem={handleTogglePlanItem}
              onPlanReady={handlePlanReady}
            />
          </section>

          {/* Booking */}
          <BookingSection
            onOpenQuoteModal={(quote) => {
              setQuoteData(quote);
              setModalState('quote');
            }}
            addToast={addToast}
          />
        </div>
      </main>

      {/* ============ MODALS ============ */}
      {/* 1. Learn More Modal */}
      <Modal
        title="Get ready for Doomsday"
        isOpen={modalState === 'learn-more'}
        onClose={() => setModalState(null)}
        actions={[
          { label: 'Close', onClick: () => setModalState(null) },
          {
            label: 'Get Started',
            primary: true,
            onClick: () => {
              setModalState(null);
              go('#movies');
            },
          },
        ]}
      >
        <ol className="list-decimal pl-5 space-y-2">
          <li>Mark the films you've already seen in <b>Your Movies</b>.</li>
          <li>Check <b>Rewatch Plan</b> for what's left and how long it takes.</li>
          <li>Pick a cinema and group size in <b>Booking</b> and get a quote.</li>
        </ol>
      </Modal>

      {/* 2. Add Movie Modal */}
      <Modal
        title="Add movie"
        isOpen={modalState === 'add-movie'}
        onClose={() => setModalState(null)}
        actions={[
          { label: 'Cancel', onClick: () => setModalState(null) },
          { label: 'Add movie', primary: true, onClick: handleAddMovieSubmit },
        ]}
      >
        <div className="space-y-3">
          <label className="block">
            <span className="block text-[11.5px] text-white/70 mb-1.5">Title</span>
            <input
              type="text"
              placeholder="e.g. Black Panther"
              value={addTitle}
              onChange={(e) => setAddTitle(e.target.value)}
              className={inputClass}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-[11.5px] text-white/70 mb-1.5">Year</span>
              <input
                type="number"
                placeholder="2026"
                value={addYear}
                onChange={(e) => setAddYear(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="block text-[11.5px] text-white/70 mb-1.5">Runtime (min)</span>
              <input
                type="number"
                placeholder="140"
                value={addMin}
                onChange={(e) => setAddMin(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
          <label className="block">
            <span className="block text-[11.5px] text-white/70 mb-1.5">Poster image URL (optional)</span>
            <input
              type="text"
              placeholder="https://image.tmdb.org/t/p/w500/..."
              value={addPoster}
              onChange={(e) => setAddPoster(e.target.value)}
              className={inputClass}
            />
          </label>
        </div>
      </Modal>

      {/* 3. Booking Quote Modal */}
      <Modal
        title="Your quote"
        isOpen={modalState === 'quote'}
        onClose={() => setModalState(null)}
        actions={[
          { label: 'Cancel', onClick: () => setModalState(null) },
          { label: 'Confirm booking', primary: true, onClick: handleConfirmBooking },
        ]}
      >
        {quoteData && (
          <div className="space-y-3">
            <div className="rounded-xl border border-line bg-white/[.04] p-4 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-white/60">Cinema</span>
                <span className="text-white font-medium">{quoteData.cinema}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Group</span>
                <span className="text-white font-medium">
                  {quoteData.groupSize} seats · {quoteData.bundles} bundles
                </span>
              </div>
              {quoteData.breakdown && quoteData.breakdown.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/60">Optimal Bundles</span>
                  <span className="text-vio-300 font-medium">
                    {quoteData.breakdown.map((b) => `${b.count} × (Size ${b.size})`).join(' + ')}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 mt-2 border-t border-line text-[15px] font-semibold">
                <span className="text-white">Total</span>
                <span className="text-vio-400">৳{quoteData.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <label className="block">
              <span className="block text-[11.5px] text-white/70 mb-1.5">Show date</span>
              <input
                type="date"
                min={todayStr}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className={inputClass}
              />
            </label>

            <div className="block">
              <span className="block text-[11.5px] text-white/70 mb-1.5 font-medium">Show time</span>
              <GlassSelect
                value={bookingTime}
                onChange={setBookingTime}
                options={['6:00 PM', '9:00 PM', 'Midnight']}
                icon={<ClockIcon className="w-4 h-4 text-vio-400" />}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 4. Movie Info Aesthetic Modal */}
      <MovieInfoModal
        movie={activeMovieInfo}
        isOpen={Boolean(activeMovieInfo)}
        onClose={() => setActiveMovieInfo(null)}
        onToggleWatched={handleToggleMovie}
        onSetAsTarget={(targetId) => {
          handleSelectTargetMovie(targetId);
          go('#plan');
        }}
      />
    </div>
  );
}
