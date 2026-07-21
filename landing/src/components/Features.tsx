import { Bluetooth, Coins, EyeOff, Smartphone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

function BLEMeshIllustration() {
  const reduceMotion = useReducedMotion();
  const nodes = [
    { x: "20%", y: "50%", label: "You", primary: true },
    { x: "50%", y: "22%", label: "Node A" },
    { x: "80%", y: "50%", label: "Node B" },
    { x: "50%", y: "78%", label: "Node C" },
  ];
  const edges = [
    { x1: "20%", y1: "50%", x2: "50%", y2: "22%", delay: "0s" },
    { x1: "50%", y1: "22%", x2: "80%", y2: "50%", delay: "0.5s" },
    { x1: "20%", y1: "50%", x2: "50%", y2: "78%", delay: "1s" },
    { x1: "50%", y1: "78%", x2: "80%", y2: "50%", delay: "1.5s" },
    { x1: "50%", y1: "22%", x2: "50%", y2: "78%", delay: "0.75s" },
  ];

  return (
    <div className="relative h-48 w-full overflow-hidden border-b border-gray-100 bg-gray-50">
      <style>{`
        @keyframes meshFlow { to { stroke-dashoffset: -24; } }
        .mesh-edge { animation: meshFlow 2.5s linear infinite; }
      `}</style>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="#9ca3af"
            strokeWidth="0.8"
            strokeDasharray="3 3"
            className="mesh-edge"
            style={{ animationDelay: e.delay }}
          />
        ))}
      </svg>
      {nodes.map((node) => (
        <div
          key={node.label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{ left: node.x, top: node.y }}
        >
          {node.primary && !reduceMotion && (
            <motion.div
              animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut", repeatDelay: 0.6 }}
              className="absolute h-8 w-8 rounded-full border-2 border-black"
            />
          )}
          <div
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white shadow-sm ${
              node.primary ? "border-black" : "border-gray-300"
            }`}
          >
            <Bluetooth size={12} className={node.primary ? "text-black" : "text-gray-400"} />
          </div>
          <span className="mt-1 rounded border border-gray-100 bg-white px-1 font-mono text-[8px] font-bold text-gray-600">
            {node.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function EncryptionIllustration() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative h-48 w-full overflow-hidden border-b border-gray-100 bg-gray-50">
      <style>{`
        @keyframes encryptFlow { to { stroke-dashoffset: -30; } }
        .encrypt-line { animation: encryptFlow 3s linear infinite; }
      `}</style>
      <svg
        className="absolute inset-0 h-full w-full text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="18%"
          y1="50%"
          x2="50%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="encrypt-line"
          style={{ animationDelay: "0s" }}
        />
        <line
          x1="82%"
          y1="50%"
          x2="50%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="encrypt-line"
          style={{ animationDelay: "1.5s" }}
        />
        <line
          x1="50%"
          y1="16%"
          x2="50%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity="0.5"
          className="encrypt-line"
          style={{ animationDelay: "0.75s" }}
        />
      </svg>

      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: "18%", top: "50%" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white font-mono text-xs text-gray-500 shadow-sm">
          A
        </div>
      </div>
      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: "82%", top: "50%" }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white font-mono text-xs text-gray-500 shadow-sm">
          B
        </div>
      </div>
      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ left: "50%", top: "16%" }}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-gray-300 bg-white font-mono text-[10px] text-gray-400 shadow-sm">
          C
        </div>
        <span className="mt-1 font-mono text-[7px] tracking-widest text-gray-400 uppercase">
          relay
        </span>
      </div>

      <div className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <svg
          viewBox="0 0 140 140"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          {!reduceMotion && (
            <>
              <motion.circle
                cx={70}
                cy={70}
                fill="none"
                stroke="#374151"
                strokeWidth={1}
                initial={{ r: 28 }}
                animate={{ r: [28, 67], opacity: [0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
              />
              <motion.circle
                cx={70}
                cy={70}
                fill="none"
                stroke="#374151"
                strokeWidth={1}
                initial={{ r: 28 }}
                animate={{ r: [28, 67], opacity: [0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut", delay: 1.25 }}
              />
            </>
          )}
        </svg>
        <motion.div
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="relative z-10 flex h-14 w-14 flex-col items-center justify-center rounded-full border border-gray-800 bg-black text-white shadow-lg"
        >
          <EyeOff size={18} />
          <span className="mt-1 font-mono text-[7px] font-bold tracking-widest text-gray-300 uppercase">
            E2E
          </span>
        </motion.div>
      </div>
    </div>
  );
}

function PaymentIllustration() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-gray-100 bg-gray-50">
      <div className="absolute h-40 w-40 animate-[spin_60s_linear_infinite] rounded-full border border-dashed border-gray-200" />
      <div className="absolute h-24 w-24 animate-[spin_45s_linear_infinite_reverse] rounded-full border border-gray-200" />

      <div className="absolute left-[14%] flex flex-col items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm">
          <Smartphone size={16} />
        </div>
        <span className="mt-1 font-mono text-[8px] text-gray-400">sender</span>
      </div>

      <div className="absolute right-[14%] flex flex-col items-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm">
          <Smartphone size={16} />
        </div>
        <span className="mt-1 font-mono text-[8px] text-gray-400">receiver</span>
      </div>

      <motion.div
        animate={
          reduceMotion
            ? { x: 0, y: -36, opacity: 1, scale: 1.1 }
            : {
                x: [-65, -28, 0, 28, 65],
                y: [4, -26, -36, -26, 4],
                opacity: [0, 1, 1, 1, 0],
                scale: [0.75, 1, 1.1, 1, 0.75],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 2.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 1.2,
              }
        }
        className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-lg"
      >
        <Coins size={16} />
      </motion.div>
    </div>
  );
}

function NoAccountsIllustration() {
  const lines = [
    { label: "type:", value: "Ed25519" },
    { label: "storage:", value: "OS Keychain" },
    { label: "server:", value: "none" },
    { label: "email:", value: "none" },
    { label: "phone:", value: "none" },
    { label: "status:", value: "READY" },
  ];

  return (
    <div className="relative flex h-48 w-full flex-col justify-center overflow-hidden border-b border-gray-100 bg-gray-50 p-4 font-mono text-[9px] text-gray-400 sm:text-[10px]">
      <div className="space-y-1 select-none">
        {lines.map((line, i) => (
          <motion.div
            key={line.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.25, delay: i * 0.07 }}
            className="flex items-center space-x-2"
          >
            <span className="w-16 font-semibold text-gray-400">{line.label}</span>
            <span
              className={
                line.value === "READY"
                  ? "font-bold text-green-500"
                  : line.value === "none"
                    ? "text-gray-300"
                    : "font-semibold text-gray-600"
              }
            >
              {line.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Features() {
  const featuresList = [
    {
      title: "Bluetooth mesh",
      description:
        "Communicate with nearby devices over multi-hop BLE without any internet. Messages relay automatically up to 7 hops across the mesh.",
      component: <BLEMeshIllustration />,
    },
    {
      title: "End-to-end encryption",
      description:
        "Every session uses Noise XX. Stored messages use Double Ratchet forward secrecy. Panic wipe destroys all keys and data in under one second.",
      component: <EncryptionIllustration />,
    },
    {
      title: "Offline payments",
      description:
        "Ecash tokens travel the same mesh as messages. Send payments directly over BLE with no internet, no payment processor, and no fees at the point of transfer.",
      component: <PaymentIllustration />,
    },
    {
      title: "No accounts, ever",
      description:
        "Identity is an Ed25519 key pair generated on-device, stored in OS Keychain. No sign-up, no email, no phone number. Nothing registers anywhere.",
      component: <NoAccountsIllustration />,
    },
  ];

  return (
    <section
      id="features"
      className="border-t border-gray-100 bg-white px-6 py-16 md:px-12 md:py-24"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4">
          <div className="font-mono text-xs font-semibold tracking-[0.25em] text-gray-500 uppercase">
            FEATURES
          </div>
          <h2 className="max-w-2xl text-xl leading-tight font-extrabold text-black sm:text-2xl md:text-3xl">
            Built for situations where normal apps stop working.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
          {featuresList.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
              className="group flex flex-col justify-between overflow-hidden border border-gray-200 bg-white transition-colors duration-200 hover:border-black"
            >
              <div className="relative">{feature.component}</div>
              <div className="space-y-3 p-6 sm:p-8">
                <h3 className="font-sans text-lg font-bold text-black sm:text-xl">
                  {feature.title}
                </h3>
                <p className="font-mono text-xs leading-relaxed font-light text-gray-600 sm:text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
