import CardTexture from "@/components/ui/CardTexture";
import LeaderLabel from "@/components/ui/LeaderLabel";
import SectionHeader from "@/components/ui/SectionHeader";
import { useInView } from "@/hooks/useInView";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";

const RelayMap = lazy(() => import("./RelayMap"));

const RELAY_MAP_FALLBACK = (
  <div className="px-6 pt-5 pb-3">
    <div className="mb-2 h-4" />
    <div style={{ aspectRatio: "800 / 356" }} />
  </div>
);

const STEPS = [
  {
    n: "01",
    title: "Discover",
    line: "Phones running Airhop or bitchat find each other automatically over Bluetooth. No pairing, no setup.",
  },
  {
    n: "02",
    title: "Relay",
    line: "A message hops phone to phone, up to seven hops. The phones in between never see what they carry.",
  },
  {
    n: "03",
    title: "Reach further",
    line: "When there is internet, Nostr relays carry the same conversation further, optionally routed through Tor.",
  },
];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();
  const { ref: relayMapRef, inView: relayMapInView } = useInView<HTMLDivElement>();

  const ink = "var(--dg-ink)";
  const mute = "var(--dg-mute)";
  const line = "var(--dg-line)";
  const fill = "var(--dg-fill)";
  const relay = "var(--relay)";

  return (
    <section id="how-it-works" className="scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="How it works"
          title="The mesh forms itself."
          sub="Nearby nodes form a self-healing mesh over Bluetooth. When there is internet, Nostr relays extend it, with no infrastructure anyone controls."
        />

        <div className="mt-6 flex justify-center">
          <Link
            to="/architecture"
            className="group border-line bg-card-subtle text-secondary hover:border-line-strong hover:bg-inner hover:text-ink inline-flex h-11 items-center gap-2 rounded-full border pr-4 pl-5 font-mono text-[11px] font-semibold tracking-widest uppercase transition-colors duration-150"
          >
            Read the full architecture
            <ArrowRight
              size={13}
              className="flex-shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.2, delay: i * 0.05, ease: "easeOut" }}
              className="group border-line bg-card hover:border-line-strong relative flex min-h-[228px] flex-col overflow-hidden rounded-2xl border p-6 transition-colors duration-200"
            >
              <CardTexture numeral={step.n} />

              <div className="relative mt-auto">
                <LeaderLabel as="h3" label={step.title} />
              </div>

              <p className="text-secondary relative mt-3 text-sm leading-relaxed">{step.line}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mx-auto mt-4 max-w-6xl select-none"
        >
          <p className="text-secondary mb-2 text-center font-mono text-[10px] font-semibold tracking-widest uppercase lg:hidden">
            &#8592; swipe to explore &#8594;
          </p>

          <div className="border-line bg-card overflow-hidden rounded-2xl border">
            <div className="border-line border-b px-6 py-3 select-none">
              <p className="text-secondary font-mono text-[10px] font-bold tracking-widest uppercase">
                &#9679; BLE mesh &middot; local peer-to-peer network
              </p>
            </div>

            <div className="overflow-x-auto p-6 [contain:layout] sm:p-8">
              <svg
                width="850"
                height="380"
                viewBox="0 0 850 380"
                className="mx-auto block"
                aria-hidden="true"
              >
                <style>{`
                  @keyframes blePathFlow { to { stroke-dashoffset: -40; } }
                  .ble-f { stroke-dasharray: 1 9; stroke-linecap: round; animation: blePathFlow 6s linear infinite; }
                  .ble-r { stroke-dasharray: 1 9; stroke-linecap: round; animation: blePathFlow 8s linear infinite reverse; }
                `}</style>

                <path
                  d="M 185,187 Q 285,92 385,187"
                  fill="none"
                  stroke={ink}
                  strokeWidth="2.5"
                  className="ble-f"
                />
                <path
                  d="M 185,193 Q 285,292 385,193"
                  fill="none"
                  stroke={mute}
                  strokeWidth="2"
                  className="ble-r"
                />
                <path
                  d="M 465,187 Q 565,92 665,187"
                  fill="none"
                  stroke={ink}
                  strokeWidth="2.5"
                  className="ble-f"
                />
                <path
                  d="M 465,193 Q 565,292 665,193"
                  fill="none"
                  stroke={mute}
                  strokeWidth="2"
                  className="ble-r"
                />

                {!reduceMotion && (
                  <>
                    <circle r="3.5" fill={ink}>
                      <animateMotion
                        dur="1.8s"
                        repeatCount="indefinite"
                        path="M 185,187 Q 285,92 385,187"
                      />
                    </circle>
                    <circle r="3.5" fill={ink}>
                      <animateMotion
                        dur="1.8s"
                        repeatCount="indefinite"
                        begin="0.9s"
                        path="M 465,187 Q 565,92 665,187"
                      />
                    </circle>
                  </>
                )}

                <line
                  x1="94"
                  y1="83"
                  x2="128"
                  y2="154"
                  stroke={line}
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <line
                  x1="425"
                  y1="72"
                  x2="425"
                  y2="150"
                  stroke={line}
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <line
                  x1="756"
                  y1="83"
                  x2="722"
                  y2="154"
                  stroke={relay}
                  strokeWidth="1.5"
                  strokeDasharray="2 4"
                  opacity="0.7"
                />
                <line
                  x1="190"
                  y1="292"
                  x2="161"
                  y2="227"
                  stroke={line}
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <line
                  x1="660"
                  y1="292"
                  x2="689"
                  y2="227"
                  stroke={line}
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />

                <rect
                  x="204"
                  y="103"
                  width="162"
                  height="16"
                  rx="2"
                  fill={fill}
                  stroke={line}
                  strokeWidth="1"
                />
                <text
                  x="285"
                  y="114"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fill={mute}
                >
                  &#9670; BLE RELAY (UP TO 7 HOPS)
                </text>

                <circle cx="85" cy="65" r="20" fill={fill} stroke={mute} strokeWidth="1.5" />
                <circle cx="85" cy="58" r="5" fill="none" stroke={mute} strokeWidth="1.5" />
                <path
                  d="M 78,68 Q 78,66 85,66 Q 92,66 92,68"
                  fill="none"
                  stroke={mute}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <circle cx="425" cy="52" r="20" fill={fill} stroke={mute} strokeWidth="1.5" />
                <circle cx="425" cy="45" r="5" fill="none" stroke={mute} strokeWidth="1.5" />
                <path
                  d="M 418,55 Q 418,53 425,53 Q 432,53 432,55"
                  fill="none"
                  stroke={mute}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <text
                  x="425"
                  y="88"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fill={mute}
                >
                  RELAY
                </text>

                <text
                  x="765"
                  y="28"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="bold"
                  fill={relay}
                >
                  NOSTR (ONLINE)
                </text>
                <circle cx="765" cy="65" r="20" fill={fill} stroke={relay} strokeWidth="1.5" />
                <circle cx="765" cy="70" r="2" fill={relay} />
                <path
                  d="M 758,64 A 10,10 0 0 1 772,64"
                  fill="none"
                  stroke={relay}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 753,58 A 17,17 0 0 1 777,58"
                  fill="none"
                  stroke={relay}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.55"
                />

                <circle cx="198" cy="310" r="20" fill={fill} stroke={mute} strokeWidth="1.5" />
                <circle cx="198" cy="303" r="5" fill="none" stroke={mute} strokeWidth="1.5" />
                <path
                  d="M 191,313 Q 191,311 198,311 Q 205,311 205,313"
                  fill="none"
                  stroke={mute}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <text
                  x="198"
                  y="346"
                  textAnchor="middle"
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                  fill={mute}
                >
                  CONTACT
                </text>

                <circle cx="652" cy="310" r="20" fill={fill} stroke={mute} strokeWidth="1.5" />
                <circle cx="652" cy="303" r="5" fill="none" stroke={mute} strokeWidth="1.5" />
                <path
                  d="M 645,313 Q 645,311 652,311 Q 659,311 659,313"
                  fill="none"
                  stroke={mute}
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
                    <circle cx={cx} cy="190" r="40" fill={fill} stroke={ink} strokeWidth="2" />
                    <circle
                      cx={cx}
                      cy="190"
                      r="37"
                      fill="none"
                      stroke={line}
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
                      stroke={ink}
                      strokeWidth="1.8"
                    />
                    <circle cx={cx} cy="202" r="2" fill="none" stroke={ink} strokeWidth="1.5" />
                    <text
                      x={cx}
                      y="248"
                      textAnchor="middle"
                      fontSize="12"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                      fill={ink}
                    >
                      {label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="divide-line border-line grid grid-cols-2 divide-x divide-y border-t select-none sm:grid-cols-4 sm:divide-y-0">
              <div className="text-secondary flex items-center justify-center gap-2.5 px-4 py-4 font-mono text-[11px]">
                <span className="border-ink bg-card h-3 w-3 flex-shrink-0 rounded-full border-2" />
                <span>BLE mesh node (offline)</span>
              </div>
              <div className="text-secondary flex items-center justify-center gap-2.5 px-4 py-4 font-mono text-[11px]">
                <svg width="32" height="8" className="flex-shrink-0" aria-hidden="true">
                  <line
                    x1="0"
                    y1="4"
                    x2="32"
                    y2="4"
                    stroke={ink}
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                </svg>
                <span>Multi-hop relay (Noise XX encrypted)</span>
              </div>
              <div className="text-secondary flex items-center justify-center gap-2.5 px-4 py-4 font-mono text-[11px]">
                <svg width="32" height="8" className="flex-shrink-0" aria-hidden="true">
                  <line
                    x1="0"
                    y1="4"
                    x2="32"
                    y2="4"
                    stroke={mute}
                    strokeWidth="1.5"
                    strokeDasharray="3 6"
                  />
                </svg>
                <span>bitchat compatible on the same mesh</span>
              </div>
              <div className="text-secondary flex items-center justify-center gap-2.5 px-4 py-4 font-mono text-[11px]">
                <svg width="32" height="8" className="flex-shrink-0" aria-hidden="true">
                  <line
                    x1="0"
                    y1="4"
                    x2="32"
                    y2="4"
                    stroke={relay}
                    strokeWidth="1.5"
                    strokeDasharray="2 4"
                    opacity="0.7"
                  />
                </svg>
                <span>Nostr bridge (internet, when online)</span>
              </div>
            </div>
          </div>

          <div
            ref={relayMapRef}
            className="border-line bg-card mt-4 overflow-hidden rounded-2xl border"
          >
            {relayMapInView ? (
              <Suspense fallback={RELAY_MAP_FALLBACK}>
                <RelayMap />
              </Suspense>
            ) : (
              RELAY_MAP_FALLBACK
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
