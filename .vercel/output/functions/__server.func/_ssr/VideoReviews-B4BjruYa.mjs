import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as Play, g as Star } from "../_libs/lucide-react.mjs";
const VIDEOS = [
  {
    fallbackTitle: "Smart Dental Review",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=rU60QTdrIeE"
  },
  {
    fallbackTitle: "CQC Approval Made Easy with AIOM Software - Review Worth Sharing",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=ybRyHlzYjoI"
  },
  {
    fallbackTitle: "Review",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=w_ofCd5RGIo"
  },
  {
    fallbackTitle: "Novo's Dental Practice",
    fallbackAuthor: "Smart Dental Compliance & Training",
    url: "https://www.youtube.com/watch?v=12arq8alwX0"
  }
];
const TEXT_REVIEWS = [
  { quote: "Made our CQC inspection a non-event. Worth every penny.", author: "Practice Owner, London" },
  { quote: "One company, all our certificates in one place - finally.", author: "Practice Manager, Glasgow" }
];
function extractYouTubeVideoId(url) {
  try {
    const parsedUrl = new URL(url);
    const shortId = parsedUrl.hostname.includes("youtu.be") ? parsedUrl.pathname.slice(1) : null;
    const watchId = parsedUrl.searchParams.get("v");
    const embedId = parsedUrl.pathname.startsWith("/embed/") ? parsedUrl.pathname.split("/embed/")[1] : null;
    return shortId || watchId || embedId || "";
  } catch {
    return "";
  }
}
function buildEmbedUrl(videoId) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    rel: "0",
    playsinline: "1",
    controls: "1",
    modestbranding: "1"
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
function VideoReviews() {
  const [activeVideoId, setActiveVideoId] = reactExports.useState(null);
  const [videoMeta, setVideoMeta] = reactExports.useState({});
  reactExports.useEffect(() => {
    let cancelled = false;
    async function loadVideoMeta() {
      const metaEntries = await Promise.all(
        VIDEOS.map(async (video) => {
          const videoId = extractYouTubeVideoId(video.url);
          if (!videoId) {
            return null;
          }
          const fallbackMeta = {
            title: video.fallbackTitle,
            authorName: video.fallbackAuthor,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            embedUrl: buildEmbedUrl(videoId)
          };
          try {
            const response = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`
            );
            if (!response.ok) {
              return [videoId, fallbackMeta];
            }
            const data = await response.json();
            return [
              videoId,
              {
                title: data.title || fallbackMeta.title,
                authorName: data.author_name || fallbackMeta.authorName,
                thumbnailUrl: data.thumbnail_url || fallbackMeta.thumbnailUrl,
                embedUrl: fallbackMeta.embedUrl
              }
            ];
          } catch {
            return [videoId, fallbackMeta];
          }
        })
      );
      if (cancelled) {
        return;
      }
      const nextMeta = Object.fromEntries(metaEntries.filter((entry) => Boolean(entry)));
      reactExports.startTransition(() => setVideoMeta(nextMeta));
    }
    void loadVideoMeta();
    return () => {
      cancelled = true;
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-surface px-4 py-20 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta", children: "What our clients say" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl", children: "Trusted by dental practices across the UK" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: VIDEOS.map((video, index) => {
      const videoId = extractYouTubeVideoId(video.url);
      const meta = videoId ? videoMeta[videoId] : null;
      const title = meta?.title || video.fallbackTitle;
      const author = meta?.authorName || video.fallbackAuthor;
      const thumbnailUrl = meta?.thumbnailUrl || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "");
      const embedUrl = meta?.embedUrl || (videoId ? buildEmbedUrl(videoId) : "");
      const isActive = activeVideoId === videoId;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "figure",
        {
          className: "group",
          onMouseEnter: () => videoId && setActiveVideoId(videoId),
          onMouseLeave: () => setActiveVideoId((currentId) => currentId === videoId ? null : currentId),
          onFocus: () => videoId && setActiveVideoId(videoId),
          onBlur: () => setActiveVideoId((currentId) => currentId === videoId ? null : currentId),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[9/12] overflow-hidden rounded-2xl bg-ink shadow-soft", children: embedUrl && isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "iframe",
              {
                src: embedUrl,
                title: `${title} testimonial`,
                className: "absolute inset-0 h-full w-full",
                allow: "autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                allowFullScreen: true
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              thumbnailUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: thumbnailUrl,
                  alt: title,
                  className: "absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105",
                  loading: "lazy"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 gradient-purple-orange opacity-80" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-white/95 p-4 shadow-glow transition-transform group-hover:scale-110 group-focus-within:scale-110", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-6 w-6 fill-magenta text-magenta" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute inset-0 z-10 cursor-pointer",
                  "aria-label": `Play ${title}`,
                  onClick: () => videoId && setActiveVideoId(videoId)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-3 right-3 z-10 text-xs text-white/80", children: "Hover to autoplay" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line-clamp-2 text-sm font-semibold text-foreground", children: title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: author })
            ] })
          ]
        },
        `${video.url}-${index}`
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-4 sm:grid-cols-2", children: TEXT_REVIEWS.map((review) => /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "rounded-2xl border border-border bg-background p-6 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5 text-gold", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-gold" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-foreground", children: [
        '"',
        review.quote,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-3 text-sm text-muted-foreground", children: [
        "- ",
        review.author
      ] })
    ] }, review.author)) })
  ] }) });
}
export {
  VideoReviews as V
};
