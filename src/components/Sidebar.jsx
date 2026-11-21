import logoImg from '../assets/logo.jpg';
import { FilmIcon, CalendarIcon, TicketIcon, XIcon } from './Icons';

export default function Sidebar({
  activeSection = 'movies',
  onNavigate,
  mobileOpen = false,
  onCloseMobile,
}) {
  const handleNavClick = (section) => {
    onNavigate?.(section);
    onCloseMobile?.();
  };

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col h-full relative z-10">
      {/* Mobile Close Button */}
      {isMobile && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="absolute top-4 right-3 z-30 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}

      {/* Logo & Brand */}
      <div className="px-3 pt-6 shrink-0 flex flex-col items-center text-center group cursor-pointer">
        <div className="relative w-14 h-14 rounded-2xl overflow-hidden p-0.5 bg-white/[0.04] border border-white/15 shadow-[0_0_25px_rgba(139,60,240,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(139,60,240,0.65)] transition-all duration-300">
          <img
            src={logoImg}
            alt="Doomsday Ready Logo"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="mt-2 text-[17px] font-bold tracking-tight text-white leading-tight">
          Doomsday<br />
          <span className="text-vio-400 font-extrabold">Ready</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 flex flex-col gap-2.5 shrink-0 relative z-10">
        <a
          href="#movies"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('movies');
          }}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all ${
            activeSection === 'movies'
              ? 'bg-gradient-to-r from-vio-600 to-vio-500 shadow-[0_0_20px_rgba(139,60,240,.5)] text-white'
              : 'text-white/90 hover:bg-white/5'
          }`}
        >
          <span className="w-5 h-5 shrink-0 flex items-center justify-center">
            <FilmIcon className="w-5 h-5" />
          </span>
          Movies
        </a>

        <a
          href="#plan"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('plan');
          }}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
            activeSection === 'plan'
              ? 'bg-gradient-to-r from-vio-600 to-vio-500 shadow-[0_0_20px_rgba(139,60,240,.5)] text-white'
              : 'text-white/90 hover:bg-white/5'
          }`}
        >
          <span className="w-5 h-5 shrink-0 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </span>
          Rewatch Plan
        </a>

        <a
          href="#booking"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('booking');
          }}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all ${
            activeSection === 'booking'
              ? 'bg-gradient-to-r from-vio-600 to-vio-500 shadow-[0_0_20px_rgba(139,60,240,.5)] text-white'
              : 'text-white/90 hover:bg-white/5'
          }`}
        >
          <span className="w-5 h-5 shrink-0 flex items-center justify-center">
            <TicketIcon className="w-5 h-5" />
          </span>
          Booking
        </a>
      </nav>

      <div className="mx-5 mt-4 h-px bg-line shrink-0"></div>

      {/* Sidebar art (Cinematic Doomsday Badge) */}
      <div className="relative mx-3 my-4 flex-1 min-h-[130px] rounded-2xl overflow-hidden flex flex-col items-center justify-center shrink border border-violet-500/20 shadow-[inset_0_0_30px_rgba(139,60,240,0.15)] group">
        <div
          id={isMobile ? 'img-sidebar-mobile' : 'img-sidebar'}
          className="img-slot absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            backgroundImage: 'linear-gradient(180deg,#0c071a 0%,#240e3f 50%,#3b136f 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0615]/80 via-transparent to-[#0a0615]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.25)_0%,transparent_70%)]" />

        <div className="relative z-10 text-center px-3 py-2 pointer-events-none select-none flex flex-col items-center">
          <span className="text-[10.5px] uppercase font-['Cinzel'] tracking-[0.32em] text-violet-300/85 font-semibold mb-1 drop-shadow-sm">
            Are you ready
          </span>
          <span className="text-[15px] font-['Cinzel'] font-black tracking-[0.2em] uppercase bg-gradient-to-r from-violet-100 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(192,132,252,0.7)]">
            for Doomsday?
          </span>
          <div className="mt-2 w-10 h-[1.5px] bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-vio-700/30 to-transparent pointer-events-none"></div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        id="sidebar"
        className="relative hidden lg:flex w-[170px] shrink-0 flex-col border-r border-line bg-[#0a0615] h-screen sticky top-0 overflow-y-auto no-scrollbar select-none z-30"
      >
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={onCloseMobile}
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
          aria-hidden="true"
        />

        {/* Slide-in Drawer */}
        <aside
          className={`relative z-10 w-[230px] h-full flex flex-col border-r border-line bg-[#0a0615] shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-transform duration-300 ease-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {renderContent(true)}
        </aside>
      </div>
    </>
  );
}
