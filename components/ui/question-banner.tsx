import React from "react";

interface QuestionBannerProps {
  children: React.ReactNode;
  className?: string;
}

export function QuestionBanner({
  children,
  className = "",
}: QuestionBannerProps) {
  return (
    <div className={`relative w-[1200px] mx-auto py-2 ${className}`}>
      <div className="relative group perspective-1000">
        {/* Main Banner Shape */}
        <div
          className="relative flex items-center justify-center min-h-16 px-16 py-3 transform transition-transform"
          style={{
            // Custom shape using clip-path to mimic the screenshot's banner
            clipPath:
              "polygon(2rem 0%, calc(100% - 2rem) 0%, 100% 50%, calc(100% - 2rem) 100%, 2rem 100%, 0% 50%)",
            background:
              "linear-gradient(90deg, #46225560 0%, #ef6351 45%, #46225560 100%)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* Top Glassy Highlight */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-linear-to-b from-[#f19e93]/30 to-transparent pointer-events-none"
            style={{ borderRadius: "1px" }}
          />

          {/* Bottom Shadow/Depth */}
          <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-linear-to-t from-black/40 to-transparent pointer-events-none mask-image:linear-gradient(to-l, transparent 0%, black 100%)" />

          {/* Content */}
          <div className="relative z-10 text-center pb-1.5 max-w-[80%]">
            <h2 className="text-[1.7rem] text-white">
              {children}
            </h2>
          </div>

          {/* Optional: Side decorative elements (internal glow) */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[5%] bg-linear-to-l from-transparent via-[#ff8c61] o-transparent pointer-events-none"
            style={{ borderRadius: "1px" }}
          />
        </div>
      </div>
    </div>
  );
}
