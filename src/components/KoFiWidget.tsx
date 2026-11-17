import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

function KoFiMark({ className = 'h-6 w-6' }: { className?: string }) {
  return <img className={className} src="https://i.postimg.cc/svLwzFqf/ko-fi-logo.png" alt="" aria-hidden="true" />;
}

export function KoFiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ left: number; top: number } | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; left: number; top: number; moved: boolean } | null>(null);
  const draggedRef = useRef(false);
  const widgetRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLElement>(null);

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
    if (!isOpen || !triggerRef.current || !popupRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const popupWidth = Math.min(popupRect.width, window.innerWidth - 36);
    const popupHeight = popupRect.height;
    const gap = 12;
    const left = Math.max(18, Math.min(window.innerWidth - popupWidth - 18, triggerRect.right - popupWidth));
    const top = triggerRect.top >= popupHeight + gap + 18
      ? triggerRect.top - popupHeight - gap
      : Math.max(18, Math.min(window.innerHeight - popupHeight - 18, triggerRect.bottom + gap));
    setPopupPosition({ left, top });
    closeRef.current?.focus();
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;
    const reposition = () => {
      if (!triggerRef.current || !popupRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const popupWidth = Math.min(popupRect.width, window.innerWidth - 36);
      const popupHeight = popupRect.height;
      const gap = 12;
      const left = Math.max(18, Math.min(window.innerWidth - popupWidth - 18, triggerRect.right - popupWidth));
      const top = triggerRect.top >= popupHeight + gap + 18
        ? triggerRect.top - popupHeight - gap
        : Math.max(18, Math.min(window.innerHeight - popupHeight - 18, triggerRect.bottom + gap));
      setPopupPosition({ left, top });
    };
    window.addEventListener('resize', reposition);
    return () => window.removeEventListener('resize', reposition);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (!position || !triggerRef.current) return;
      const maxLeft = window.innerWidth - triggerRef.current.offsetWidth - 8;
      const maxTop = window.innerHeight - triggerRef.current.offsetHeight - 8;
      setPosition(current => current ? {
        left: Math.max(8, Math.min(maxLeft, current.left)),
        top: Math.max(8, Math.min(maxTop, current.top)),
      } : null);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < 7) return;
    drag.moved = true;
    setPosition({
      left: Math.max(8, Math.min(window.innerWidth - event.currentTarget.offsetWidth - 8, drag.left + dx)),
      top: Math.max(8, Math.min(window.innerHeight - event.currentTarget.offsetHeight - 8, drag.top + dy)),
    });
  };

  const finishDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) return;
    draggedRef.current = dragRef.current.moved;
    dragRef.current = null;
  };

  return (
    <aside
      ref={widgetRef}
      aria-label="Support MazBayID"
      className={`fixed z-[60] flex flex-col items-end gap-3 touch-none ${position ? '' : 'bottom-5 right-5 sm:bottom-6 sm:right-6'}`}
      style={position ? { left: position.left, top: position.top } : undefined}
    >
      {isOpen && (
        <section
          ref={popupRef}
          id="kofi-popup"
          aria-labelledby="kofi-popup-title"
          style={popupPosition ? { position: 'fixed', left: popupPosition.left, top: popupPosition.top } : { position: 'fixed', left: 18, top: 18 }}
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClick={() => {
          if (draggedRef.current) {
            draggedRef.current = false;
            return;
          }
          setIsOpen(open => !open);
        }}
        aria-label={isOpen ? 'Close Ko-fi support popup' : 'Open Ko-fi support popup'}
        aria-expanded={isOpen}
        aria-controls="kofi-popup"
        className="grid h-14 w-14 cursor-grab touch-none select-none place-items-center rounded-full border border-white/70 bg-[#51f3e5] p-1 text-[#071b20] shadow-[0_8px_28px_rgba(0,0,0,.4),0_0_0_5px_rgba(81,243,229,.18)] transition duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_34px_rgba(0,0,0,.45),0_0_0_7px_rgba(81,243,229,.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51f3e5] motion-reduce:transform-none motion-reduce:transition-none"
      >
        <KoFiMark className="h-11 w-11 max-h-full max-w-full object-contain object-center" />
      </button>
    </aside>
  );
}
