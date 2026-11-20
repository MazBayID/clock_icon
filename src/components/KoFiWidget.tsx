import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

function KoFiMark({ className = 'h-6 w-6' }: { className?: string }) {
  return <img className={className} src="https://cdn.simpleicons.org/kofi/000000" alt="" aria-hidden="true" />;
}

export function KoFiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; left: number; top: number; moved: boolean } | null>(null);
  const draggedRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (!position || !triggerRef.current) return;
      const maxLeft = Math.max(8, window.innerWidth - triggerRef.current.offsetWidth - 8);
      const maxTop = Math.max(8, window.innerHeight - triggerRef.current.offsetHeight - 8);
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

  const closeModal = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <aside
        aria-label="Support MazBayID"
        className={`fixed z-[60] touch-none ${position ? '' : 'bottom-5 right-5 sm:bottom-6 sm:right-6'}`}
        style={position ? { left: position.left, top: position.top } : undefined}
      >
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
            setIsOpen(true);
          }}
          aria-label="Open Ko-fi donation panel"
          aria-expanded={isOpen}
          aria-controls="kofi-modal"
          className="grid h-14 w-14 cursor-grab touch-none select-none place-items-center rounded-full border border-white/70 bg-[#43d8cf] p-1 text-[#071b20] shadow-[0_8px_28px_rgba(0,0,0,.4),0_0_0_5px_rgba(67,216,207,.18)] transition duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_34px_rgba(0,0,0,.45),0_0_0_7px_rgba(67,216,207,.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#51f3e5] motion-reduce:transform-none motion-reduce:transition-none"
        >
          <KoFiMark className="h-11 w-11 max-h-full max-w-full object-contain object-center" />
        </button>
      </aside>

      {isOpen && (
        <div
          id="kofi-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Support MazBayID on Ko-fi"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-2 backdrop-blur-sm sm:p-3"
        >
          <section className="flex h-[min(760px,calc(100dvh-16px))] w-full max-w-[480px] flex-col overflow-hidden rounded-xl border border-[#43d8cf]/40 bg-[#f9f9f9] shadow-2xl sm:h-[min(760px,calc(100dvh-24px))] sm:rounded-2xl">
            <div className="flex h-[42px] shrink-0 items-center justify-end bg-[#f9f9f9] px-2">
              <button
                ref={closeRef}
                type="button"
                onClick={closeModal}
                aria-label="Close donation panel"
                className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#e9eeed] text-[21px] leading-none text-[#263b39] hover:bg-[#dce5e3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#263b39]"
              >
                ×
              </button>
            </div>
            <iframe
              className="min-h-0 w-full flex-1 border-0 bg-[#f9f9f9] px-1 pb-1"
              src="https://ko-fi.com/mazbayid/?hidefeed=true&widget=true&embed=true&preview=true"
              title="MazBayID Ko-fi donation panel"
              loading="eager"
              allow="payment"
            />
          </section>
        </div>
      )}
    </>
  );
}
