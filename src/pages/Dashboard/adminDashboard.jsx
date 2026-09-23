import React from "react";
import Table from "../../components/reusable/table";

const AdminDashboard = () => {
  const departments = [
    { name: "BPT (PHYSIOTHERAPY)", count: 46 },
    { name: "BMLT", count: 15 },
    { name: "MBA CORE", count: 15 },
    { name: "LLB", count: 11 },
    { name: "B.DESIGN", count: 9 },
    { name: "PHARMACY", count: 8 },
    { name: "CS", count: 7 },
  ];

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .animate-marquee {
            animation: marquee 25s linear infinite;
            width: max-content;
          }

          .animate-marquee:hover {
            animation-play-state: paused;
          }

          @keyframes livePulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.45;
              transform: scale(0.8);
            }
          }

          .live-pulse {
            animation: livePulse 1.3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="p-6">

        {/* ================= BULLETIN / LIVE TICKER ================= */}
        <div
          className="
            relative overflow-hidden
            mb-6
            rounded-2xl
            border border-red-300/40
            bg-gradient-to-r from-red-800 via-red-600 to-red-700
            shadow-lg shadow-red-700/30
          "
        >
          {/* Diagonal Warning Texture */}
          <div
            className="
              absolute inset-0 pointer-events-none opacity-[0.12]
              bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgba(255,255,255,0.35)_10px,rgba(255,255,255,0.35)_12px)]
            "
          />

          <div className="relative flex items-center min-h-[64px] px-3 py-2 gap-3">

            {/* Warning Icon */}
            <div
              className="
                flex-shrink-0
                w-10 h-10
                rounded-full
                border border-white/30
                bg-white/15
                backdrop-blur-md
                flex items-center justify-center
                shadow-inner
              "
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Delayed Counter */}
            <div
              className="
                flex-shrink-0
                rounded-lg
                border border-white/20
                bg-black/10
                px-3 py-1.5
                text-center
                leading-none
              "
            >
              <div className="text-white text-lg font-extrabold">
                182
              </div>

              <div className="text-red-100 text-[9px] font-bold tracking-wider">
                DELAYED
              </div>
            </div>

            {/* Main Text */}
            <div className="flex-shrink-0 hidden xl:block">
              <p className="text-white text-sm font-semibold whitespace-nowrap">
                <span className="font-extrabold">Action Required</span>
                <span className="mx-2 text-red-200">—</span>
                182 delayed tasks across 26 sub-departments:
              </p>
            </div>

            {/* Marquee */}
            <div className="relative flex-1 min-w-0 overflow-hidden">

              {/* Left Fade */}
              <div className="absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-red-700 to-transparent pointer-events-none" />

              <div className="overflow-hidden">
                <div className="animate-marquee flex items-center gap-2 whitespace-nowrap">

                  {/* First Set */}
                  {departments.map((department, index) => (
                    <div
                      key={`first-${index}`}
                      className="
                        flex items-center gap-2
                        flex-shrink-0
                        rounded-full
                        border border-white/20
                        bg-white/15
                        backdrop-blur-md
                        px-3 py-1.5
                        text-white
                      "
                    >
                      <span className="text-xs font-semibold">
                        {department.name}
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-white/25
                          border border-white/20
                          px-2 py-0.5
                          text-[10px]
                          font-extrabold
                        "
                      >
                        ×{department.count}
                      </span>
                    </div>
                  ))}

                  {/* Second Set - Seamless Loop */}
                  {departments.map((department, index) => (
                    <div
                      key={`second-${index}`}
                      className="
                        flex items-center gap-2
                        flex-shrink-0
                        rounded-full
                        border border-white/20
                        bg-white/15
                        backdrop-blur-md
                        px-3 py-1.5
                        text-white
                      "
                    >
                      <span className="text-xs font-semibold">
                        {department.name}
                      </span>

                      <span
                        className="
                          rounded-full
                          bg-white/25
                          border border-white/20
                          px-2 py-0.5
                          text-[10px]
                          font-extrabold
                        "
                      >
                        ×{department.count}
                      </span>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            {/* Live Feed */}
            <div
              className="
                hidden 2xl:flex
                flex-shrink-0
                items-center gap-1.5
                text-white
                text-xs font-bold
                whitespace-nowrap
              "
            >
              <span className="live-pulse text-red-200 text-lg leading-none">
                ●
              </span>

              <span>Live Feed</span>
            </div>

            {/* View Delayed CTA */}
            <button
              className="
                hidden lg:flex
                flex-shrink-0
                items-center gap-2
                rounded-full
                border border-white/30
                bg-white/15
                hover:bg-white/25
                backdrop-blur-md
                px-4 py-2
                text-white
                text-xs font-bold
                whitespace-nowrap
                transition-all duration-200
              "
            >
              View Delayed (182)
              <span className="text-sm">→</span>
            </button>

            {/* Urgent Badge */}
            <div
              className="
                hidden md:flex
                flex-shrink-0
                items-center gap-1.5
                rounded-full
                border border-white/25
                bg-white/15
                backdrop-blur-md
                px-3 py-1.5
                text-white
                text-xs font-extrabold
              "
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              URGENT
            </div>

          </div>
        </div>

        {/* ================= GREEN WELCOME BANNER ================= */}
        <div className="bg-green-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

            {/* Left Content */}
            <div className="flex-1">
              <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
                Welcome back, Admin!
              </h1>

              <p className="text-green-100 text-sm md:text-base max-w-2xl">
                Here is today's overview across all departments, task statuses,
                and pending approval workflows.
              </p>
            </div>

            {/* Right Content */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            </div>

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <Table />

      </div>
    </>
  );
};

export default AdminDashboard;