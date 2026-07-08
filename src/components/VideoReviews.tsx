import { Play, Star } from "lucide-react";

// Replace `embed` with a YouTube/Vimeo embed URL, e.g. "https://www.youtube.com/embed/VIDEO_ID"
const VIDEOS = [
  { name: "Dr A. Patel", practice: "Bright Smile Dental, Manchester", embed: "" },
  { name: "Dr S. Khan", practice: "City Dental Studio, Leeds", embed: "" },
  { name: "L. Roberts (Practice Manager)", practice: "Riverside Dental, Bristol", embed: "" },
  { name: "Dr H. Singh", practice: "Modern Dental Care, Birmingham", embed: "" },
];

const TEXT_REVIEWS = [
  { quote: "Made our CQC inspection a non-event. Worth every penny.", author: "Practice Owner, London" },
  { quote: "One company, all our certificates in one place — finally.", author: "Practice Manager, Glasgow" },
];

export function VideoReviews() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta">
            What our clients say
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Trusted by dental practices across the UK</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((v) => (
            <figure key={v.name} className="group">
              <div className="relative aspect-[9/12] overflow-hidden rounded-2xl bg-ink shadow-soft">
                {v.embed ? (
                  <iframe
                    src={v.embed}
                    title={`${v.name} testimonial`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 gradient-purple-orange opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-white/95 p-4 shadow-glow transition-transform group-hover:scale-110">
                        <Play className="h-6 w-6 fill-magenta text-magenta" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-xs text-white/80">Video coming soon</div>
                  </>
                )}
              </div>
              <figcaption className="mt-3">
                <div className="text-sm font-semibold text-foreground">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.practice}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TEXT_REVIEWS.map((r) => (
            <blockquote key={r.author} className="rounded-2xl border border-border bg-background p-6 shadow-soft">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold" />)}
              </div>
              <p className="mt-3 text-foreground">“{r.quote}”</p>
              <footer className="mt-3 text-sm text-muted-foreground">— {r.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
