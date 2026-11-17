import { useEffect, useRef, useState } from 'react';

function KoFiMark({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 8h13v7.2A4.8 4.8 0 0 1 12.2 20H8.8A4.8 4.8 0 0 1 4 15.2V8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 10h1.2a2.8 2.8 0 1 1 0 5.6H17M8 4.5c1.2 1 1.2 2 0 3M12 4.5c1.2 1 1.2 2 0 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.5 11.2c-.8-1.1-2.5-.5-2.5.8 0 1.1 1.5 2.1 2.5 2.8 1-.7 2.5-1.7 2.5-2.8 0-1.3-1.7-1.9-2.5-.8Z" fill="currentColor" />
    </svg>
  );
}

export function KoFiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !widgetRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  return (
    <aside
      ref={widgetRef}
      aria-label="Support MazBayID"
      className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      {isOpen && (
        <section
          id="kofi-popup"
          aria-labelledby="kofi-popup-title"
          className="w-[min(310px,calc(100vw-36px))] rounded-2xl border border-[#ff5e5b]/50 bg-gradient-to-br from-[#111422]/[.98] to-[#23121f]/[.98] p-5 shadow-[0_18px_60px_rgba(0,0,0,.5),0_0_30px_rgba(255,94,91,.12)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ff5e5b] text-white">
                <KoFiMark className="h-5 w-5" />
              </span>
              <span id="kofi-popup-title">Ko-fi</span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close Ko-fi popup"
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/[0.07] text-xl leading-none text-slate-300 transition-colors hover:bg-white/[0.13] hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="my-4 text-sm leading-relaxed text-slate-300">
            Enjoying Neo Clock Studio? Your support helps MazBayID keep building useful tools and exploring new ideas.
          </p>
          <a
            href="https://ko-fi.com/mazbayid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#ff5e5b] px-4 text-sm font-bold text-white transition-colors hover:bg-[#ff7471] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51f3e5]"
          >
            Support on Ko-fi <span aria-hidden="true">↗</span>
          </a>
        </section>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close Ko-fi support popup' : 'Open Ko-fi support popup'}
        aria-expanded={isOpen}
        aria-controls="kofi-popup"
        className="grid h-14 w-14 place-items-center rounded-full border border-white/70 bg-[#ff5e5b] text-white shadow-[0_8px_28px_rgba(0,0,0,.4),0_0_0_5px_rgba(255,94,91,.16)] transition duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_34px_rgba(0,0,0,.45),0_0_0_7px_rgba(255,94,91,.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51f3e5] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <KoFiMark className="h-7 w-7" />
      </button>
    </aside>
  );
}
