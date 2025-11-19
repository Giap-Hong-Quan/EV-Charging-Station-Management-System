import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <section className="relative min-h-[100dvh] grid place-items-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">
      {/* glowing decor */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(147,197,253,0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(52,211,153,0.15), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-6 flex flex-col items-center gap-6 text-center">
        {/* 403 number */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-green-300 bg-clip-text text-transparent [background-size:200%] [animation:shine_5s_linear_infinite]">
          403
        </h1>

        {/* lock icon animation */}
        <div
          className="w-24 h-24 border-4 border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          style={{ animation: "pulseGlow 3s ease-in-out infinite" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-12 h-12 text-emerald-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0V10.5m-.75 0h10.5a.75.75 0 01.75.75v9a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-9a.75.75 0 01.75-.75z"
            />
          </svg>
        </div>

        <p className="max-w-lg text-slate-300/90">
          Bạn không có quyền truy cập vào trang này.<br />
          Vui lòng quay lại trang chính hoặc đăng nhập với tài khoản có quyền
          cao hơn.
        </p>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium bg-emerald-500/90 hover:bg-emerald-400 transition"
          >
            Về trang chủ
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium border border-white/15 hover:bg-white/5 transition"
          >
            Đăng nhập lại
          </Link>
        </div>
      </div>

      {/* rotating border ring */}
      <div
        className="pointer-events-none absolute inset-0 grid place-items-center -z-10"
        aria-hidden
      >
        <div
          className="h-[36rem] w-[36rem] rounded-full border border-white/10"
          style={{ animation: "spinSlow 45s linear infinite" }}
        />
      </div>

      {/* animation keyframes */}
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50% }
          100% { background-position: 200% 50% }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(16,185,129,0.3); transform: scale(1); }
          50% { box-shadow: 0 0 60px rgba(16,185,129,0.5); transform: scale(1.05); }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg) }
        }
      `}</style>
    </section>
  );
}
