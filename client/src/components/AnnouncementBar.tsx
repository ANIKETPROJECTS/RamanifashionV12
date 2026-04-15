import { useQuery } from "@tanstack/react-query";

interface AnnouncementItem {
  _id: string;
  text: string;
  isActive: boolean;
  order: number;
}

const COPIES = 8;

export default function AnnouncementBar() {
  const { data: items } = useQuery<AnnouncementItem[]>({
    queryKey: ["/api/announcement-bar"],
    staleTime: 60000,
  });

  if (!items || items.length === 0) return null;

  const separator = "\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0";
  const singleCopy = items.map((i) => i.text).join(separator) + separator;

  const charCount = singleCopy.length;
  const durationSecs = Math.max(12, charCount * 0.15);

  // Animate exactly one copy's worth: -100% / COPIES of total track width
  const shiftPercent = (100 / COPIES).toFixed(6);

  return (
    <div
      className="w-full overflow-hidden select-none"
      style={{ backgroundColor: "hsl(338, 78%, 62%)" }}
      data-testid="announcement-bar"
    >
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${shiftPercent}%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: marquee-scroll ${durationSecs}s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="py-2 text-sm font-medium tracking-wide whitespace-nowrap">
        <div className="marquee-track" style={{ color: "#ffffff" }}>
          {Array.from({ length: COPIES }, (_, i) => (
            <span key={i}>{singleCopy}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
