import { motion } from "motion/react";
import RelayMap from "./RelayMap";

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

          <div className="rounded-xl border border-gray-200 bg-gray-50/50">
            {/* BLE mesh diagram label */}
            <div className="border-b border-gray-200 px-6 py-3 select-none">
              <p className="font-mono text-[9px] font-bold tracking-widest text-gray-400 uppercase">
                &#9679; BLE mesh &mdash; local peer-to-peer network
              </p>
            </div>

            <div className="overflow-x-auto p-6 sm:p-8">
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

                <path
                  d="M 185,187 Q 285,92 385,187"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  className="ble-f"
                />
                <path
                  d="M 185,193 Q 285,292 385,193"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  className="ble-r"
                />
                <path
                  d="M 465,187 Q 565,92 665,187"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="2"
                  className="ble-f"
                />
                <path
                  d="M 465,193 Q 565,292 665,193"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  className="ble-r"
                />

                <line
                  x1="94"
                  y1="83"
                  x2="128"
                  y2="154"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <line
                  x1="425"
                  y1="72"
                  x2="425"
                  y2="150"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <line
                  x1="756"
                  y1="83"
                  x2="722"
                  y2="154"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <line
                  x1="190"
                  y1="292"
                  x2="161"
                  y2="227"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <line
                  x1="660"
                  y1="292"
                  x2="689"
                  y2="227"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />

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

                <circle cx="85" cy="65" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
                <circle cx="85" cy="58" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                <path
                  d="M 78,68 Q 78,66 85,66 Q 92,66 92,68"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

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

                <circle cx="765" cy="65" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
                <circle cx="765" cy="58" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                <path
                  d="M 758,68 Q 758,66 765,66 Q 772,66 772,68"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

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

                <circle cx="652" cy="310" r="20" fill="white" stroke="#9ca3af" strokeWidth="1.5" />
                <circle cx="652" cy="303" r="5" fill="none" stroke="#9ca3af" strokeWidth="1.5" />
                <path
                  d="M 645,313 Q 645,311 652,311 Q 659,311 659,313"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {(
                  [
                    { cx: 145, label: "Node 1" },
                    { cx: 425, label: "Node 2" },
                    { cx: 705, label: "Node 3" },
                  ] as { cx: number; label: string }[]
                ).map(({ cx, label }) => (
                  <g key={cx}>
                    <circle cx={cx} cy="190" r="40" fill="white" stroke="black" strokeWidth="2" />
                    <circle
                      cx={cx}
                      cy="190"
                      r="37"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
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
                    <circle cx={cx} cy="202" r="2" fill="none" stroke="black" strokeWidth="1.5" />
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

            {/* Legend */}
            <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200 select-none">
              <div className="flex items-center justify-center gap-2.5 px-4 py-4 font-mono text-[11px] text-gray-500">
                <span className="h-3 w-3 flex-shrink-0 rounded-full border-2 border-black bg-white" />
                <span>BLE mesh node (offline)</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 px-4 py-4 font-mono text-[11px] text-gray-500">
                <svg width="32" height="8" className="flex-shrink-0" aria-hidden="true">
                  <line
                    x1="0"
                    y1="4"
                    x2="32"
                    y2="4"
                    stroke="#374151"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                </svg>
                <span>Multi-hop relay (Noise XX encrypted)</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 px-4 py-4 font-mono text-[11px] text-gray-500">
                <svg width="32" height="8" className="flex-shrink-0" aria-hidden="true">
                  <line
                    x1="0"
                    y1="4"
                    x2="32"
                    y2="4"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    strokeDasharray="3 6"
                  />
                </svg>
                <span>bitchat compatible on the same mesh</span>
              </div>
            </div>

            {/* Nostr global reach — real relay map */}
            <RelayMap />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
