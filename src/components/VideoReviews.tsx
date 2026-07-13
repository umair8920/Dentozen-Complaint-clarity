import { Play, Star } from "lucide-react";
import { startTransition, useEffect, useState } from "react";

type VideoEntry = {
  fallbackTitle: string;
  fallbackAuthor: string;
  url: string;
};

type VideoMeta = {
  title: string;
  authorName: string;
  thumbnailUrl: string;
  embedUrl: string;
};

const VIDEOS: VideoEntry[] = [
  {
    fallbackTitle: "Smart Dental Review",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=rU60QTdrIeE",
  },
  {
    fallbackTitle: "Meet Dr. Safa, the smile behind Serene Dental in Knightsbridge.",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=xabMX6nK5ck",
  },
  {
    fallbackTitle: "Review",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=w_ofCd5RGIo",
  },
  {
    fallbackTitle: "Novo's Dental Practice",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=12arq8alwX0",
  },
];

const TEXT_REVIEWS = [
  {
    quote: "Made our CQC inspection a non-event. Worth every penny.",
    author: "Practice Owner, London",
  },
  {
    quote: "One company, all our certificates in one place - finally.",
    author: "Practice Manager, Glasgow",
  },
];

function extractYouTubeVideoId(url: string) {
  try {
    const parsedUrl = new URL(url);
    const shortId = parsedUrl.hostname.includes("youtu.be") ? parsedUrl.pathname.slice(1) : null;
    const watchId = parsedUrl.searchParams.get("v");
    const embedId = parsedUrl.pathname.startsWith("/embed/")
      ? parsedUrl.pathname.split("/embed/")[1]
      : null;

    return shortId || watchId || embedId || "";
  } catch {
    return "";
  }
}

function buildEmbedUrl(videoId: string) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    rel: "0",
    playsinline: "1",
    controls: "1",
    modestbranding: "1",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function VideoReviews() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<Record<string, VideoMeta>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadVideoMeta() {
      const metaEntries = await Promise.all(
        VIDEOS.map(async (video) => {
          const videoId = extractYouTubeVideoId(video.url);

          if (!videoId) {
            return null;
          }

          const fallbackMeta: VideoMeta = {
            title: video.fallbackTitle,
            authorName: video.fallbackAuthor,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            embedUrl: buildEmbedUrl(videoId),
          };

          try {
            const response = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`,
            );

            if (!response.ok) {
              return [videoId, fallbackMeta] as const;
            }

            const data = (await response.json()) as {
              title?: string;
              author_name?: string;
              thumbnail_url?: string;
            };

            return [
              videoId,
              {
                title: data.title || fallbackMeta.title,
                authorName: data.author_name || fallbackMeta.authorName,
                thumbnailUrl: data.thumbnail_url || fallbackMeta.thumbnailUrl,
                embedUrl: fallbackMeta.embedUrl,
              },
            ] as const;
          } catch {
            return [videoId, fallbackMeta] as const;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      const nextMeta = Object.fromEntries(
        metaEntries.filter((entry): entry is readonly [string, VideoMeta] => Boolean(entry)),
      );
      startTransition(() => setVideoMeta(nextMeta));
    }

    void loadVideoMeta();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-surface px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta">
            What our clients say
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Trusted by dental practices across the UK
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEOS.map((video, index) => {
            const videoId = extractYouTubeVideoId(video.url);
            const meta = videoId ? videoMeta[videoId] : null;
            const title = meta?.title || video.fallbackTitle;
            const author = meta?.authorName || video.fallbackAuthor;
            const thumbnailUrl =
              meta?.thumbnailUrl ||
              (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "");
            const embedUrl = meta?.embedUrl || (videoId ? buildEmbedUrl(videoId) : "");
            const isActive = activeVideoId === videoId;

            return (
              <figure
                key={`${video.url}-${index}`}
                className="group"
                onMouseEnter={() => videoId && setActiveVideoId(videoId)}
                onMouseLeave={() =>
                  setActiveVideoId((currentId) => (currentId === videoId ? null : currentId))
                }
                onFocus={() => videoId && setActiveVideoId(videoId)}
                onBlur={() =>
                  setActiveVideoId((currentId) => (currentId === videoId ? null : currentId))
                }
              >
                <div className="relative aspect-[9/12] overflow-hidden rounded-2xl bg-ink shadow-soft">
                  {embedUrl && isActive ? (
                    <iframe
                      src={embedUrl}
                      title={`${title} testimonial`}
                      className="absolute inset-0 h-full w-full"
                      allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={title}
                          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 gradient-purple-orange opacity-80" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-white/95 p-4 shadow-glow transition-transform group-hover:scale-110 group-focus-within:scale-110">
                          <Play className="h-6 w-6 fill-magenta text-magenta" />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="absolute inset-0 z-10 cursor-pointer"
                        aria-label={`Play ${title}`}
                        onClick={() => videoId && setActiveVideoId(videoId)}
                      />
                      <div className="absolute bottom-3 left-3 right-3 z-10 text-xs text-white/80">
                        Hover to autoplay
                      </div>
                    </>
                  )}
                </div>
                <figcaption className="mt-3">
                  <div className="line-clamp-2 text-sm font-semibold text-foreground">{title}</div>
                  <div className="text-xs text-muted-foreground">{author}</div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {TEXT_REVIEWS.map((review) => (
            <blockquote
              key={review.author}
              className="rounded-2xl border border-border bg-background p-6 shadow-soft"
            >
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <p className="mt-3 text-foreground">"{review.quote}"</p>
              <footer className="mt-3 text-sm text-muted-foreground">- {review.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
