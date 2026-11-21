import { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const SLIDES = [
  {
    t: 'House of the Dragon',
    g: 'linear-gradient(90deg,#0b0712,#1a1020 50%,#2a1414)',
    trailer: '',
  },
  {
    t: 'Agatha All Along',
    g: 'linear-gradient(90deg,#0b0712,#1b0f2e 50%,#3b0764)',
    trailer: '',
  },
  {
    t: 'Loki',
    g: 'linear-gradient(90deg,#0b0712,#10241c 50%,#14532d)',
    trailer: '',
  },
  {
    t: 'What If…?',
    g: 'linear-gradient(90deg,#0b0712,#1e1b4b 50%,#312e81)',
    trailer: '',
  },
];

export default function BottomBanner({ onWatchNow, isModalOpen = false }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const titleRef = useRef(null);

  const changeSlide = (nextIdx, dir = 1) => {
    const gsap = window.gsap;
    if (gsap && titleRef.current) {
      gsap.timeline()
        .to(titleRef.current, { x: -16 * dir, opacity: 0, duration: 0.2 })
        .add(() => {
          setSlideIndex((nextIdx + SLIDES.length) % SLIDES.length);
        })
        .fromTo(titleRef.current, { x: 16 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
    } else {
      setSlideIndex((nextIdx + SLIDES.length) % SLIDES.length);
    }
  };

  const prevSlide = () => changeSlide(slideIndex - 1, -1);
  const nextSlide = () => changeSlide(slideIndex + 1, 1);

  useEffect(() => {
    if (isHovered || isModalOpen) return;
    const interval = setInterval(() => {
      changeSlide(slideIndex + 1, 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideIndex, isHovered, isModalOpen]);

  const current = SLIDES[slideIndex];

  return (
    <section
      id="banner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="panel mt-[18px] relative overflow-hidden rounded-2xl border border-line h-[132px]"
    >
      {/* Background slide */}
      <div
        id="img-banner"
        className="img-slot absolute inset-0 transition-all duration-500"
        style={{
          backgroundImage: current.g,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07040f]/90 via-[#07040f]/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-7 max-w-[520px]">
        <h3
          ref={titleRef}
          id="bTitle"
          className="text-[26px] font-bold leading-tight text-white tracking-tight"
        >
          {current.t}
        </h3>
        <p className="mt-1 text-[13px] text-white/90 leading-snug">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <button
          type="button"
          onClick={() => onWatchNow(current)}
          className="mt-2.5 inline-flex w-max items-center gap-1.5 rounded-lg border border-vio-400/40 bg-vio-600/30 backdrop-blur-md px-3 py-1 text-[11.5px] font-medium text-vio-300 hover:bg-vio-600/50 hover:border-vio-400/70 shadow-sm transition-all cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="currentColor">
            <path d="M7 4v16l13-8z" />
          </svg>
          Watch Now
        </button>
      </div>

      {/* Navigation arrows */}
      <button
        id="bPrev"
        aria-label="Previous"
        onClick={prevSlide}
        className="absolute right-[64px] top-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full border border-white/20 bg-black/40 backdrop-blur-md grid place-items-center text-white hover:bg-black/70 hover:border-white/50 transition-all cursor-pointer"
      >
        <span className="w-3.5 h-3.5 flex items-center justify-center">
          <ChevronLeftIcon className="w-3.5 h-3.5" />
        </span>
      </button>

      <button
        id="bNext"
        aria-label="Next"
        onClick={nextSlide}
        className="absolute right-[22px] top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full border border-white/25 bg-black/40 backdrop-blur-md grid place-items-center text-white hover:bg-black/70 hover:border-white/60 transition-all cursor-pointer"
      >
        <span className="w-4 h-4 flex items-center justify-center">
          <ChevronRightIcon className="w-4 h-4" />
        </span>
      </button>

      {/* Dots */}
      <div id="dots" className="absolute right-5 bottom-3 flex gap-1.5">
        {SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => changeSlide(k, k > slideIndex ? 1 : -1)}
            aria-label={`Slide ${k + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              k === slideIndex ? 'w-3.5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
