import { reviews } from "@/app/data/reviews";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-foreground/70">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[11px] tracking-[0.3em] uppercase text-foreground/50 text-center mb-12">
          Loved by 1000+ Customers
        </h2>
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="snap-start shrink-0 w-[280px] bg-warm rounded-sm p-6 flex flex-col gap-3"
            >
              <Stars count={review.rating} />
              <p className="text-sm text-foreground/70 leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="text-[11px] tracking-[0.1em] text-foreground/50 mt-auto">
                — {review.name}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="#reviews"
            className="text-[10px] tracking-[0.2em] uppercase text-foreground/50 hover:text-foreground transition-colors underline underline-offset-4"
          >
            See All Reviews →
          </a>
        </div>
      </div>
    </section>
  );
}
