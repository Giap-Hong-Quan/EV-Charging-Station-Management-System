// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="relative min-h-[100dvh] grid place-items-center overflow-hidden bg-slate-950 text-white">
      {/* decor blobs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, #34d399 40%, transparent 60%)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-52 -right-32 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, #38bdf8 40%, transparent 60%)",
          animation: "float 9s ease-in-out infinite reverse",
        }}
      />

      <div className="relative z-10 mx-6 flex flex-col items-center gap-6 text-center">
        {/* 404 number with gradient shine */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent [background-size:200%] [animation:shine_5s_linear_infinite]">
          404
        </h1>

        {/* floating ghost illustration */}
        <div className="relative">
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
            style={{ animation: "float 3s ease-in-out infinite" }}
          >
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
            </defs>
            <path
              d="M75 20c24 0 40 16 40 40v46c0 3-4 5-7 3-8-6-12 1-18 1-9 0-12-7-15-7s-6 7-15 7c-6 0-10-7-18-1-3 2-7 0-7-3V60c0-24 16-40 40-40z"
              fill="url(#g)"
            />
            <circle cx="60" cy="65" r="7" fill="#0f172a" />
            <circle cx="90" cy="65" r="7" fill="#0f172a" />
            <path
              d="M60 90c10 8 20 8 30 0"
              fill="none"
              stroke="#0f172a"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-x-0 -bottom-3 h-3 rounded-full bg-black/30 blur-xl mx-auto w-28 opacity-60" />
        </div>

        <p className="max-w-xl text-slate-300/90">
          Ôi! Trang bạn tìm không tồn tại hoặc đã bị di chuyển. Hãy quay lại
          trang chính nhé.
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium bg-emerald-500/90 hover:bg-emerald-400 transition"
          >
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium border border-white/15 hover:bg-white/5 transition"
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* subtle rotating ring */}
      <div
        className="pointer-events-none absolute inset-0 -z-0 grid place-items-center"
        aria-hidden
      >
        <div
          className="h-[38rem] w-[38rem] rounded-full border border-white/10"
          style={{ animation: "spinSlow 40s linear infinite" }}
        />
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50% }
          100% { background-position: 200% 50% }
        }
        @keyframes float {
          0%,100% { transform: translateY(0px) }
          50% { transform: translateY(-12px) }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg) }
        }
      `}</style>
    </section>
  );
}
