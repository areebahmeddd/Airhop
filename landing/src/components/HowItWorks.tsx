import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="dot-grid overflow-hidden border-t border-gray-100 bg-white px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl space-y-4"
        >
          <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
            HOW IT WORKS
          </div>
          <p className="font-mono text-sm leading-relaxed font-normal text-gray-700 sm:text-base">
            Airhop nodes discover each other automatically over Bluetooth Low Energy and form a
            self-healing mesh. A message sent from one device floods the network and relays across
            nearby nodes up to 7 hops. When internet is available, Nostr relays extend the mesh
            globally without requiring any infrastructure we control.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-2 select-none"
        >
          <p className="text-center font-mono text-[9px] font-semibold tracking-widest text-gray-400 uppercase lg:hidden">
            &#8592; swipe to explore &#8594;
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8">
            <svg
              width="850"
              height="380"
              viewBox="0 0 850 380"
              className="mx-auto block"
              aria-hidden="true"
            >
              <style>{`
                @keyframes blePathFlow { to { stroke-dashoffset: -48; } }
                .ble-f { stroke-dasharray: 6 6; animation: blePathFlow 6s linear infinite; }
                .ble-r { stroke-dasharray: 6 6; animation: blePathFlow 8s linear infinite reverse; }
              `}</style>

              {/* ── Main connection arcs ─────────────────────── */}

              {/* N1 ↔ N2 — upper arc (primary path) */}
              <path
                d="M 185,187 Q 285,92 385,187"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                className="ble-f"
              />
              {/* N1 ↔ N2 — lower arc (redundant path) */}
              <path
                d="M 185,193 Q 285,292 385,193"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                className="ble-r"
              />

              {/* N2 ↔ N3 — upper arc */}
              <path
                d="M 465,187 Q 565,92 665,187"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                className="ble-f"
              />
              {/* N2 ↔ N3 — lower arc */}
              <path
                d="M 465,193 Q 565,292 665,193"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                className="ble-r"
              />

              {/* ── Satellite connection lines ───────────────── */}

              {/* SA (above-left N1) → N1 */}
              <line
                x1="94"
                y1="83"
                x2="128"
                y2="154"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
              {/* SB (above N2)  → N2 */}
              <line
                x1="425"
                y1="72"
                x2="425"
                y2="150"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
              {/* SC (above-right N3) → N3 */}
              <line
                x1="756"
                y1="83"
                x2="722"
                y2="154"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
              {/* SD (below-right N1) → N1 */}
              <line
                x1="190"
                y1="292"
                x2="161"
                y2="227"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
              {/* SE (below-left N3) → N3 */}
              <line
                x1="660"
                y1="292"
                x2="689"
                y2="227"
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />

              {/* ── Label: BLE RELAY ────────────────────────── */}

              <rect
                x="204"
                y="103"
                width="162"
                height="16"
                rx="2"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x="285"
                y="114"
                textAnchor="middle"
                fontSize="8"
                fontFamily="monospace"
                fill="#374151"
              >
                &#9670; BLE RELAY (UP TO 7 HOPS)
              </text>

              {/* ── Label: NOSTR BRIDGE ─────────────────────── */}

              <rect
                x="480"
                y="258"
                width="170"
                height="16"
                rx="2"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x="565"
                y="269"
                textAnchor="middle"
                fontSize="8"
                fontFamily="monospace"
                fill="#374151"
              >
                &#9670; NOSTR BRIDGE (WHEN ONLINE)
              </text>

              {/* ── Satellite nodes ──────────────────────────── */}

              {/* SA — above-left of N1 */}
              <circle cx="85" cy="65" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
              <circle cx="85" cy="58" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
              <path
                d="M 78,68 Q 78,66 85,66 Q 92,66 92,68"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* SB — directly above N2, labeled RELAY */}
              <circle cx="425" cy="52" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
              <circle cx="425" cy="45" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
              <path
                d="M 418,55 Q 418,53 425,53 Q 432,53 432,55"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <text
                x="425"
                y="88"
                textAnchor="middle"
                fontSize="8"
                fontFamily="monospace"
                fill="#374151"
              >
                RELAY
              </text>

              {/* SC — above-right of N3 */}
              <circle cx="765" cy="65" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
              <circle cx="765" cy="58" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
              <path
                d="M 758,68 Q 758,66 765,66 Q 772,66 772,68"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* SD — below-right of N1, labeled CONTACT */}
              <circle cx="198" cy="310" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
              <circle cx="198" cy="303" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
              <path
                d="M 191,313 Q 191,311 198,311 Q 205,311 205,313"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <text
                x="198"
                y="346"
                textAnchor="middle"
                fontSize="8"
                fontFamily="monospace"
                fill="#374151"
              >
                CONTACT
              </text>

              {/* SE — below-left of N3 */}
              <circle cx="652" cy="310" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
              <circle cx="652" cy="303" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
              <path
                d="M 645,313 Q 645,311 652,311 Q 659,311 659,313"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* ── Main phone nodes ─────────────────────────── */}

              {(
                [
                  { cx: 145, label: "Node 1" },
                  { cx: 425, label: "Node 2" },
                  { cx: 705, label: "Node 3" },
                ] as { cx: number; label: string }[]
              ).map(({ cx, label }) => (
                <g key={cx}>
                  {/* Outer circle */}
                  <circle cx={cx} cy="190" r="40" fill="white" stroke="black" strokeWidth="2" />
                  {/* Inner dashed ring */}
                  <circle
                    cx={cx}
                    cy="190"
                    r="37"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* Phone body */}
                  <rect
                    x={cx - 11}
                    y="173"
                    width="22"
                    height="34"
                    rx="2.5"
                    fill="none"
                    stroke="black"
                    strokeWidth="1.8"
                  />
                  {/* Home button */}
                  <circle cx={cx} cy="202" r="2" fill="none" stroke="black" strokeWidth="1.5" />
                  {/* Node label */}
                  <text
                    x={cx}
                    y="248"
                    textAnchor="middle"
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                    fill="black"
                  >
                    {label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* ── Legend ──────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 font-mono text-xs select-none">
          <div className="flex items-center space-x-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white">
              &#9670;
            </span>
            <span className="text-gray-600">Bluetooth Low Energy mesh (offline, no internet)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-0.5 w-6 border-t border-dashed border-gray-400" />
            <span className="text-gray-600">Multi-hop relay (Noise XX encrypted)</span>
          </div>
          <div className="flex items-center space-x-2 rounded border border-gray-200 bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-700">
            <Sparkles size={11} className="mr-1 inline-block text-gray-600" />
            bitchat compatible on the same mesh
          </div>
        </div>
      </div>
    </section>
  );
}
