export function AnnouncementBar() {
  return (
    <div className="bg-foreground text-white text-[11px] tracking-[0.2em] uppercase py-2.5 text-center">
      <span className="inline-flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.93a2 2 0 0 0 1.66-.9l.82-1.2a2 2 0 0 1 1.66-.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
          <path d="M9 18h6" />
        </svg>
        Free shipping on orders above ₹999
      </span>
    </div>
  );
}
