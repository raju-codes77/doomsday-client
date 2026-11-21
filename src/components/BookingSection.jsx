import { useState, useEffect, useRef } from 'react';
import { TicketIcon, CinemaIcon, UsersIcon, ArrowRightIcon, CheckIcon, XIcon } from './Icons';
import GlassSelect from './GlassSelect';
import cinemaSeatsHd from '../assets/banners/cinema-seats-hd.jpg';
import { cinemaApi } from '../api';

const GROUP_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1} ${i + 1 === 1 ? 'Person' : 'People'}`,
}));

export default function BookingSection({ onOpenQuoteModal, addToast }) {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState('');
  const [groupSize, setGroupSize] = useState(6);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const bundleTitleRef = useRef(null);

  // 1. Fetch cinemas from backend
  useEffect(() => {
    async function loadCinemas() {
      try {
        const data = await cinemaApi.getAll();
        setCinemas(data);
        if (data && data.length > 0) {
          setSelectedCinemaId(data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching cinemas:', err);
      }
    }
    loadCinemas();
  }, []);

  // 2. Fetch DP booking calculation from backend whenever cinema or groupSize changes
  useEffect(() => {
    if (!selectedCinemaId) return;

    let isMounted = true;
    async function fetchQuote() {
      try {
        setLoading(true);
        const data = await cinemaApi.getBookingQuote(selectedCinemaId, Number(groupSize));
        if (isMounted) {
          setQuote(data);
        }
      } catch (err) {
        if (isMounted) {
          setQuote({
            possible: false,
            totalBundles: 0,
            breakdown: [],
            message: err.message || 'Failed to calculate quote',
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchQuote();
    return () => {
      isMounted = false;
    };
  }, [selectedCinemaId, groupSize]);

  // Animate status card change
  useEffect(() => {
    const gsap = window.gsap;
    if (gsap && bundleTitleRef.current) {
      gsap.fromTo(
        bundleTitleRef.current,
        { y: 6, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [quote]);

  const selectedCinema = cinemas.find((c) => c._id === selectedCinemaId) || cinemas[0];
  const isPossible = quote?.possible ?? true;
  const totalBundles = quote?.totalBundles ?? 0;
  const breakdown = quote?.breakdown || quote?.bundles || [];

  const bundleTitle = !quote
    ? 'Calculating...'
    : isPossible
    ? `${totalBundles} Bundles: ${breakdown.map((b) => `${b.count} × ${b.size}`).join(' + ')}`
    : 'No Exact Fit';

  const bundleSub = !quote
    ? 'Checking seat availability...'
    : isPossible
    ? 'Perfect match! No empty or wasted seats.'
    : quote.message || 'Cannot seat exactly this group size with available bundle sizes.';

  const handleGetQuote = () => {
    if (!isPossible) {
      if (addToast) {
        addToast(`Cannot seat exactly ${groupSize} people at ${selectedCinema?.name}. Try another group size!`, false);
      }
      return;
    }

    onOpenQuoteModal({
      cinema: selectedCinema?.name || 'Selected Cinema',
      cinemaId: selectedCinemaId,
      groupSize: Number(groupSize),
      bundles: totalBundles,
      breakdown,
      pricePerSeat: 600,
      totalPrice: Number(groupSize) * 600,
    });
  };

  const cinemaOptions = cinemas.map((c) => ({
    value: c._id,
    label: `${c.name} (Bundles: [${c.bundleSizes.join(', ')}])`,
  }));

  return (
    <section id="booking" className="panel mt-[18px] relative rounded-2xl border border-line bg-[#0e0a1c]/80 z-20">
      {/* Background seats image container with overflow hidden */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div
          id="img-seats"
          className="img-slot absolute right-0 top-0 h-full w-[48%] opacity-90"
          style={{
            backgroundImage: `url("${cinemaSeatsHd}"), linear-gradient(90deg,transparent,rgba(124,45,224,.35) 60%,rgba(220,38,38,.35))`,
            backgroundPosition: 'center 60%',
          }}
        />
        <div className="absolute right-0 top-0 h-full w-[48%] bg-gradient-to-r from-[#0e0a1c] via-[#0e0a1c]/40 to-transparent" />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5">
        <div className="relative z-20 flex-1 min-w-0 max-w-[650px]">
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 text-vio-400 flex items-center justify-center">
              <TicketIcon className="w-9 h-9 text-vio-400" />
            </span>
            <div>
              <h2 className="text-[15px] font-semibold leading-tight text-white">Booking</h2>
              <p className="text-[11px] text-white/60 mt-0.5">Book your opening night watch party with optimal bundles</p>
            </div>
          </div>

          {/* Form */}
          <div className="mt-4 flex flex-wrap sm:flex-nowrap items-end gap-3.5">
            <div className="flex-1 min-w-[210px]">
              <p className="text-[12px] mb-2 font-medium text-white/90">Select Cinema</p>
              <GlassSelect
                value={selectedCinemaId}
                onChange={setSelectedCinemaId}
                options={cinemaOptions.length > 0 ? cinemaOptions : [{ value: '', label: 'Loading cinemas...' }]}
                icon={<CinemaIcon className="w-5 h-5 text-vio-400" />}
              />
            </div>

            <div className="w-full sm:w-[155px] shrink-0">
              <p className="text-[12px] mb-2 font-medium text-white/90">Group Size</p>
              <GlassSelect
                value={groupSize}
                onChange={setGroupSize}
                options={GROUP_OPTIONS}
                icon={<UsersIcon className="w-5 h-5 text-vio-400" />}
              />
            </div>

            <button
              onClick={handleGetQuote}
              disabled={loading || !isPossible}
              className={`btn-grad h-[44px] px-6 rounded-full text-[13px] font-semibold inline-flex items-center justify-center gap-2 text-white transition-all cursor-pointer shrink-0 w-full sm:w-auto ${
                !isPossible
                  ? 'opacity-60 cursor-not-allowed saturate-50'
                  : 'hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(147,51,234,.5)]'
              }`}
            >
              Get Quote <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status card */}
        <div className="relative z-10 lg:ml-6 lg:mr-[4%] xl:mr-[10%] flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0e0a1c]/70 backdrop-blur-xl px-5 py-5 min-w-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.08)] shrink-0">
          <span
            id="okIcon"
            className={`w-[43px] h-[43px] rounded-full grid place-items-center shrink-0 transition-colors ${
              isPossible ? 'bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
            }`}
          >
            {isPossible ? <CheckIcon className="w-6 h-6 text-white" /> : <XIcon className="w-6 h-6 text-white" />}
          </span>
          <div>
            <p ref={bundleTitleRef} id="bundleTitle" className="text-[16px] font-semibold leading-tight text-white">
              {bundleTitle}
            </p>
            <p id="bundleSub" className="text-[11.5px] text-white/70 mt-1 max-w-[220px]">
              {bundleSub}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
