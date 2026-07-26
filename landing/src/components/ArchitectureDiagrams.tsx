const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#d1d5db";
const FILL = "#fafafa";
const SOFT = "#f3f4f6";
const MONO = "JetBrains Mono, ui-monospace, monospace";

function Arrow({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
      </marker>
    </defs>
  );
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  strong?: boolean;
  dashed?: boolean;
}

function Box({ x, y, w, h, label, sub, strong, dashed }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        fill={strong ? SOFT : FILL}
        stroke={strong ? INK : LINE}
        strokeWidth={strong ? 1.5 : 1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 4}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11.5}
        fontWeight={600}
        fill={INK}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={9.5}
          fill={MUTED}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Caption({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={MONO}
      fontSize={9}
      fontWeight={700}
      fill={MUTED}
      letterSpacing="0.18em"
    >
      {children}
    </text>
  );
}

// D1: system overview
export function SystemOverview() {
  return (
    <svg
      viewBox="0 0 920 440"
      className="h-auto w-full"
      role="img"
      aria-label="Airhop system overview"
    >
      <Arrow id="ov-arrow" />
      <Caption x={20} y={26}>
        YOUR PHONE
      </Caption>
      <rect
        x={16}
        y={38}
        width={276}
        height={368}
        rx={8}
        fill="none"
        stroke={LINE}
        strokeDasharray="4 3"
      />
      <Box x={32} y={54} w={244} h={44} label="src/ui" sub="passive screens, theme tokens" />
      <Box
        x={32}
        y={110}
        w={244}
        h={44}
        label="src/features"
        sub="chats · mesh · wallet · profile"
      />
      <Box
        x={32}
        y={166}
        w={244}
        h={44}
        label="src/store"
        sub="Zustand + MMKV, encrypted at rest"
      />
      <Box x={32} y={222} w={244} h={44} label="src/services" sub="mesh-service · wallet-service" />
      <Box
        x={32}
        y={278}
        w={244}
        h={56}
        label="src/core"
        sub="crypto · mesh · nostr · payments"
        strong
      />
      <Box
        x={32}
        y={346}
        w={244}
        h={44}
        label="native module"
        sub="Swift + Kotlin, raw bytes only"
      />

      <Caption x={352} y={26}>
        TRANSPORT
      </Caption>
      <Box x={348} y={54} w={200} h={56} label="BLE mesh" sub="no internet · 7 hops" strong />
      <Box x={348} y={126} w={200} h={56} label="WiFi direct" sub="no internet · same OS only" />
      <Box x={348} y={198} w={200} h={56} label="Nostr relays" sub="internet · optional Tor" />
      <Box x={348} y={270} w={200} h={56} label="Courier" sub="no internet · carried by peers" />
      <Box
        x={348}
        y={342}
        w={200}
        h={48}
        label="Mint HTTPS"
        sub="internet · payments only"
        dashed
      />

      <Caption x={628} y={26}>
        REACHES
      </Caption>
      <Box
        x={624}
        y={54}
        w={272}
        h={56}
        label="Nearby devices"
        sub="Airhop and bitchat, one mesh"
        strong
      />
      <Box
        x={624}
        y={126}
        w={272}
        h={56}
        label="Nearby same-platform device"
        sub="faster path for large files"
      />
      <Box
        x={624}
        y={198}
        w={272}
        h={56}
        label="Anyone online, anywhere"
        sub="DMs and location channels"
      />
      <Box
        x={624}
        y={270}
        w={272}
        h={56}
        label="Someone not here yet"
        sub="delivered when paths meet"
      />
      <Box
        x={624}
        y={342}
        w={272}
        h={48}
        label="Your ecash balance"
        sub="top up, cash out, confirm"
        dashed
      />

      {[82, 154, 226, 298, 366].map((y, i) => (
        <line
          key={`l-${i}`}
          x1={280}
          y1={306}
          x2={344}
          y2={y}
          stroke={LINE}
          strokeWidth={1}
          markerEnd="url(#ov-arrow)"
        />
      ))}
      {[82, 154, 226, 298, 366].map((y, i) => (
        <line
          key={`r-${i}`}
          x1={552}
          y1={y}
          x2={620}
          y2={y}
          stroke={LINE}
          strokeWidth={1}
          markerEnd="url(#ov-arrow)"
        />
      ))}
    </svg>
  );
}

// D2: transport tiers
export function RouterLadder() {
  const rungs = [
    {
      n: "1",
      label: "Direct link",
      note: "BLE mesh, or WiFi if a link exists",
      cond: "a Noise session with them is already open",
      res: "encrypted and sent straight to them",
    },
    {
      n: "2",
      label: "Nostr DM",
      note: "NIP-17 gift wrap",
      cond: "their Nostr key is known and you are online",
      res: "goes over the internet, shown as pending",
    },
    {
      n: "3",
      label: "Courier",
      note: "sealed envelope, 24 hours",
      cond: "nothing above could carry it",
      res: "handed to peers until it reaches them",
    },
  ];
  return (
    <svg
      viewBox="0 0 920 330"
      className="h-auto w-full"
      role="img"
      aria-label="The three transport tiers the router chooses between"
    >
      <Arrow id="rl-arrow" />
      <Box x={16} y={116} w={130} h={56} label="You tap send" strong />
      <line x1={148} y1={144} x2={196} y2={144} stroke={LINE} markerEnd="url(#rl-arrow)" />
      {rungs.map((r, i) => {
        const y = 26 + i * 88;
        return (
          <g key={r.n}>
            <rect
              x={200}
              y={y}
              width={64}
              height={64}
              rx={6}
              fill={SOFT}
              stroke={INK}
              strokeWidth={1.5}
            />
            <text
              x={232}
              y={y + 39}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={18}
              fontWeight={700}
              fill={INK}
            >
              {r.n}
            </text>
            <Box x={284} y={y} w={244} h={64} label={r.label} sub={r.note} />
            <text x={552} y={y + 28} fontFamily={MONO} fontSize={10.5} fill={MUTED}>
              {r.cond}
            </text>
            <text x={552} y={y + 47} fontFamily={MONO} fontSize={10.5} fill={INK}>
              {r.res}
            </text>
            {i < 2 && (
              <line
                x1={232}
                y1={y + 64}
                x2={232}
                y2={y + 88}
                stroke={LINE}
                markerEnd="url(#rl-arrow)"
              />
            )}
          </g>
        );
      })}
      <text x={16} y={306} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Bluetooth is the path that always exists. The transport layer owns the link maps and takes
        WiFi instead when one is up, and both
      </text>
      <text x={16} y={322} fontFamily={MONO} fontSize={10} fill={MUTED}>
        carry the same Noise session, so the router never has to know which radio it got.
      </text>
    </svg>
  );
}

// D3: identity key tree
export function IdentityTree() {
  return (
    <svg
      viewBox="0 0 920 330"
      className="h-auto w-full"
      role="img"
      aria-label="Identity key derivation"
    >
      <Arrow id="id-arrow" />
      <Box
        x={16}
        y={130}
        w={200}
        h={64}
        label="Ed25519 signing key"
        sub="generated on first launch"
        strong
      />
      <Box
        x={16}
        y={216}
        w={200}
        h={64}
        label="X25519 Noise static"
        sub="generated on first launch"
        strong
      />

      <line x1={220} y1={162} x2={286} y2={70} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={220} y1={162} x2={286} y2={148} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={220} y1={248} x2={286} y2={226} stroke={LINE} markerEnd="url(#id-arrow)" />

      <Box
        x={290}
        y={44}
        w={232}
        h={54}
        label="Nostr key (secp256k1)"
        sub="HKDF, airhop-nostr-key-v1"
      />
      <Box x={290} y={120} w={232} h={54} label="Per-geohash key" sub="one identity per cell" />
      <Box x={290} y={198} w={232} h={54} label="Peer ID" sub="SHA-256(noisePub) first 8 bytes" />

      <line x1={526} y1={71} x2={588} y2={71} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={526} y1={147} x2={588} y2={147} stroke={LINE} markerEnd="url(#id-arrow)" />
      <line x1={526} y1={225} x2={588} y2={225} stroke={LINE} markerEnd="url(#id-arrow)" />

      <Box
        x={592}
        y={44}
        w={304}
        h={54}
        label="Internet DMs and nutzaps"
        sub="one stable identity everywhere"
      />
      <Box
        x={592}
        y={120}
        w={304}
        h={54}
        label="Location channel presence"
        sub="cells cannot be linked together"
      />
      <Box
        x={592}
        y={198}
        w={304}
        h={54}
        label="swift-falcon-3a9f"
        sub="deterministic name, cannot be squatted"
      />

      <text x={16} y={306} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Both roots live in the iOS Keychain or Android Keystore. Nothing derived from them is ever
        uploaded.
      </text>
    </svg>
  );
}

// D4: flood propagation
export function FloodPropagation() {
  const nodes = [
    { x: 70, y: 150, ttl: "7", label: "you", sub: "" },
    { x: 250, y: 80, ttl: "6", label: "", sub: "" },
    { x: 250, y: 220, ttl: "6", label: "", sub: "" },
    { x: 440, y: 150, ttl: "5", label: "", sub: "" },
    { x: 630, y: 80, ttl: "4", label: "", sub: "" },
    { x: 630, y: 220, ttl: "4", label: "", sub: "" },
    { x: 820, y: 150, ttl: "", label: "them", sub: "arrives with 4 unspent" },
  ];
  const edges = [
    { a: 0, b: 1, dup: false },
    { a: 0, b: 2, dup: false },
    { a: 1, b: 3, dup: false },
    { a: 2, b: 3, dup: true },
    { a: 3, b: 4, dup: false },
    { a: 3, b: 5, dup: false },
    { a: 4, b: 6, dup: false },
    { a: 5, b: 6, dup: true },
  ];
  return (
    <svg
      viewBox="0 0 900 320"
      className="h-auto w-full"
      role="img"
      aria-label="A message flooding across the mesh, spending one hop at each phone, with duplicate copies dropped where paths rejoin"
    >
      <style>{`
        @keyframes floodPulse { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
        .flood-edge { animation: floodPulse 3s ease-in-out infinite; }
      `}</style>
      {edges.map((e, i) => {
        const from = nodes[e.a];
        const to = nodes[e.b];
        const t = 0.74;
        const mx = from.x + (to.x - from.x) * t;
        const my = from.y + (to.y - from.y) * t;
        return (
          <g key={i}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={e.dup ? LINE : INK}
              strokeWidth={1.2}
              strokeDasharray="4 4"
              className="flood-edge"
              style={{ animationDelay: `${i * 0.22}s` }}
            />
            {e.dup && (
              <g stroke={MUTED} strokeWidth={1.4} strokeLinecap="round">
                <line x1={mx - 5} y1={my - 5} x2={mx + 5} y2={my + 5} />
                <line x1={mx - 5} y1={my + 5} x2={mx + 5} y2={my - 5} />
              </g>
            )}
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const isEnd = i === 6;
        return (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={26}
              fill={isEnd ? INK : i === 0 ? SOFT : "#fff"}
              stroke={INK}
              strokeWidth={i === 0 || isEnd ? 1.8 : 1.2}
            />
            {n.ttl && (
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={13}
                fontWeight={700}
                fill={INK}
              >
                {n.ttl}
              </text>
            )}
            {n.label && (
              <text
                x={n.x}
                y={n.y + 46}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={10}
                fill={MUTED}
              >
                {n.label}
              </text>
            )}
            {n.sub && (
              <text
                x={n.x}
                y={n.y + 61}
                textAnchor="middle"
                fontFamily={MONO}
                fontSize={9}
                fill={MUTED}
              >
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
      <text x={450} y={286} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={MUTED}>
        The number is the hop budget stamped on the packet as it leaves that phone.
      </text>
      <text x={450} y={302} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={MUTED}>
        ✕ is a second copy reaching a phone that already forwarded, so it is dropped.
      </text>
    </svg>
  );
}

// D5: fragmentation
export function Fragmentation() {
  return (
    <svg
      viewBox="0 0 920 260"
      className="h-auto w-full"
      role="img"
      aria-label="File fragmentation and reassembly"
    >
      <Arrow id="fr-arrow" />
      <Box x={16} y={96} w={150} h={64} label="1 MiB file" sub="image, voice, any type" strong />
      <line x1={170} y1={128} x2={214} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <Box x={218} y={96} w={140} h={64} label="split" sub="469 bytes each" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={392 + i * 34}
          y={110}
          width={26}
          height={36}
          rx={3}
          fill={SOFT}
          stroke={INK}
          strokeWidth={1.2}
        />
      ))}
      <text x={568} y={132} fontFamily={MONO} fontSize={15} fontWeight={700} fill={MUTED}>
        ...
      </text>
      <line x1={362} y1={128} x2={388} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <line x1={596} y1={128} x2={640} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <Box x={644} y={96} w={140} h={64} label="reassemble" sub="128 slots, 30 s timeout" />
      <line x1={788} y1={128} x2={824} y2={128} stroke={LINE} markerEnd="url(#fr-arrow)" />
      <Box x={828} y={96} w={78} h={64} label="file" strong />
      <text
        x={392}
        y={94}
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.18em"
      >
        ONE FRAGMENT EVERY 20 ms
      </text>
      <text x={16} y={210} fontFamily={MONO} fontSize={10} fill={MUTED}>
        The 20 ms pacing is not a throttle for politeness. Without it the radio drops fragments and
        the transfer never completes.
      </text>
      <text x={16} y={230} fontFamily={MONO} fontSize={10} fill={MUTED}>
        456 payload bytes every 20 ms is where the ~22 KB/s figure comes from, so 1 MiB takes
        roughly 45 seconds.
      </text>
    </svg>
  );
}

// D6: live voice bursts
export function VoiceBurst() {
  return (
    <svg
      viewBox="0 0 920 300"
      className="h-auto w-full"
      role="img"
      aria-label="Live voice frames batched into bursts and played through a jitter buffer"
    >
      <Arrow id="vb-arrow" />
      <Caption x={16} y={24}>
        WHILE YOU ARE STILL TALKING
      </Caption>
      <Box x={16} y={36} w={128} h={60} label="mic" sub="AAC-LC 16 kHz" strong />
      <line x1={148} y1={66} x2={186} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={190 + i * 34}
            y={48}
            width={26}
            height={36}
            rx={3}
            fill={SOFT}
            stroke={INK}
            strokeWidth={1.2}
          />
        </g>
      ))}
      <text x={332} y={70} fontFamily={MONO} fontSize={13} fontWeight={700} fill={MUTED}>
        ...
      </text>
      <text x={190} y={104} fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        64 ms each, about 130 bytes
      </text>
      <line x1={360} y1={66} x2={398} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box x={402} y={36} w={186} h={60} label="burst packet" sub="210 bytes, never fragmented" />
      <line x1={592} y1={66} x2={630} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box x={634} y={36} w={140} h={60} label="jitter buffer" sub="350 ms" />
      <line x1={778} y1={66} x2={816} y2={66} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box x={820} y={36} w={86} h={60} label="ear" strong />

      <Caption x={16} y={166}>
        WHEN YOU LET GO
      </Caption>
      <Box
        x={16}
        y={178}
        w={200}
        h={60}
        label="finalized voice note"
        sub="the same audio as a file"
        strong
      />
      <line x1={220} y1={208} x2={402} y2={208} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box
        x={406}
        y={178}
        w={228}
        h={60}
        label="sent every time"
        sub="even if the live burst worked"
      />
      <line x1={638} y1={208} x2={676} y2={208} stroke={LINE} markerEnd="url(#vb-arrow)" />
      <Box
        x={680}
        y={178}
        w={226}
        h={60}
        label="late joiners catch up"
        sub="and old clients still hear it"
      />

      <text x={16} y={272} fontFamily={MONO} fontSize={10} fill={MUTED}>
        The two paths are not alternatives. Live frames give you sub-second audio; the note that
        follows is what makes delivery
      </text>
      <text x={16} y={288} fontFamily={MONO} fontSize={10} fill={MUTED}>
        reliable. If the note arrives after a complete burst it silently replaces the partial file,
        with no second message.
      </text>
    </svg>
  );
}

// D7: gossip sync
export function GossipSync() {
  return (
    <svg
      viewBox="0 0 920 280"
      className="h-auto w-full"
      role="img"
      aria-label="Gossip sync reconciliation using a GCS filter"
    >
      <Arrow id="gs-arrow" />
      <Box x={16} y={40} w={190} h={62} label="Phone A" sub="was out of range" strong />
      <Box x={714} y={40} w={190} h={62} label="Phone B" sub="stayed in the mesh" strong />

      <line x1={210} y1={132} x2={710} y2={132} stroke={LINE} markerEnd="url(#gs-arrow)" />
      <rect
        x={330}
        y={112}
        width={260}
        height={40}
        rx={6}
        fill="#fff"
        stroke={INK}
        strokeWidth={1.2}
      />
      <text
        x={460}
        y={130}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        fill={INK}
      >
        REQUEST_SYNC + GCS filter
      </text>
      <text x={460} y={144} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        ~400 bytes describing 1000 packets
      </text>

      <line x1={710} y1={206} x2={214} y2={206} stroke={LINE} markerEnd="url(#gs-arrow)" />
      <rect
        x={330}
        y={186}
        width={260}
        height={40}
        rx={6}
        fill={SOFT}
        stroke={INK}
        strokeWidth={1.2}
      />
      <text
        x={460}
        y={204}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        fill={INK}
      >
        only what A is missing
      </text>
      <text x={460} y={218} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        1% false positive rate, never a full resend
      </text>

      <text x={16} y={262} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Runs every 15 seconds, and 5 seconds after meeting a new peer. Never relayed, so it stays a
        conversation between neighbors.
      </text>
    </svg>
  );
}

// D8: Noise XX handshake
export function NoiseHandshake() {
  const msgs = [
    { y: 96, dir: 1, label: "e", note: "initiator ephemeral, in the clear" },
    { y: 152, dir: -1, label: "e, ee, s, es", note: "responder ephemeral + its static, encrypted" },
    { y: 208, dir: 1, label: "s, se", note: "initiator static, encrypted" },
  ];
  return (
    <svg
      viewBox="0 0 920 320"
      className="h-auto w-full"
      role="img"
      aria-label="Noise XX handshake, three messages"
    >
      <Arrow id="nh-arrow" />
      <Box x={90} y={20} w={180} h={48} label="Initiator" strong />
      <Box x={650} y={20} w={180} h={48} label="Responder" strong />
      <line x1={180} y1={72} x2={180} y2={268} stroke={LINE} strokeDasharray="3 4" />
      <line x1={740} y1={72} x2={740} y2={268} stroke={LINE} strokeDasharray="3 4" />
      {msgs.map((m, i) => (
        <g key={i}>
          <line
            x1={m.dir === 1 ? 184 : 736}
            y1={m.y}
            x2={m.dir === 1 ? 736 : 184}
            y2={m.y}
            stroke={INK}
            strokeWidth={1.3}
            markerEnd="url(#nh-arrow)"
          />
          <rect x={370} y={m.y - 30} width={180} height={26} rx={4} fill="#fff" />
          <text
            x={460}
            y={m.y - 12}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={12}
            fontWeight={700}
            fill={INK}
          >
            {m.label}
          </text>
          <text
            x={460}
            y={m.y + 16}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize={9.5}
            fill={MUTED}
          >
            {m.note}
          </text>
        </g>
      ))}
      <rect
        x={280}
        y={252}
        width={360}
        height={40}
        rx={6}
        fill={SOFT}
        stroke={INK}
        strokeWidth={1.2}
      />
      <text
        x={460}
        y={270}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        fill={INK}
      >
        two directional keys, both sides authenticated
      </text>
      <text x={460} y={284} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={MUTED}>
        Noise_XX_25519_ChaChaPoly_SHA256
      </text>
    </svg>
  );
}

// D9: what protects what
export function ProtectionStack() {
  const rows = [
    ["Direct message", "Noise XX + Double Ratchet", "yes", "yes"],
    ["DM over the internet", "NIP-17 gift wrap", "yes", "yes"],
    ["Courier envelope", "Noise X to a one-time prekey", "yes", "yes"],
    ["Private channel", "XChaCha20-Poly1305, key in the link", "yes", "yes"],
    ["Private group", "ChaCha20-Poly1305 under an epoch key", "yes", "yes"],
    ["Public channel", "signed only, readable by design", "no", "yes"],
    ["Location channel", "signed only, readable by design", "no", "yes"],
    ["Attachment", "signed only, for bitchat compatibility", "no", "yes"],
  ];
  return (
    <svg
      viewBox="0 0 920 340"
      className="h-auto w-full"
      role="img"
      aria-label="What is encrypted and what is only signed"
    >
      <Caption x={16} y={22}>
        WHAT IT IS
      </Caption>
      <Caption x={250} y={22}>
        HOW IT IS PROTECTED
      </Caption>
      <Caption x={686} y={22}>
        ENCRYPTED
      </Caption>
      <Caption x={810} y={22}>
        SIGNED
      </Caption>
      {rows.map((r, i) => {
        const y = 38 + i * 36;
        const enc = r[2] === "yes";
        return (
          <g key={i}>
            <rect
              x={12}
              y={y}
              width={896}
              height={32}
              rx={4}
              fill={i % 2 === 0 ? FILL : "#fff"}
              stroke={LINE}
              strokeWidth={0.8}
            />
            <text x={24} y={y + 21} fontFamily={MONO} fontSize={11} fontWeight={600} fill={INK}>
              {r[0]}
            </text>
            <text x={250} y={y + 21} fontFamily={MONO} fontSize={10.5} fill={MUTED}>
              {r[1]}
            </text>
            <text
              x={706}
              y={y + 21}
              fontFamily={MONO}
              fontSize={11}
              fontWeight={700}
              fill={enc ? INK : MUTED}
            >
              {enc ? "yes" : "no"}
            </text>
            <text x={826} y={y + 21} fontFamily={MONO} fontSize={11} fontWeight={700} fill={INK}>
              yes
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// D10: four room types
export function RoomTypes() {
  const rooms = [
    { t: "Public channel", k: "no key", w: "anyone in range", r: "mesh only" },
    { t: "Location channel", k: "no key", w: "anyone in the cell", r: "mesh + internet" },
    {
      t: "Private channel",
      k: "key in the invite link",
      w: "anyone with the link",
      r: "mesh, optionally internet",
    },
    { t: "Private group", k: "epoch key over Noise", w: "signed roster, max 16", r: "mesh only" },
  ];
  return (
    <svg
      viewBox="0 0 920 250"
      className="h-auto w-full"
      role="img"
      aria-label="The four room types compared"
    >
      {rooms.map((r, i) => {
        const x = 12 + i * 228;
        return (
          <g key={i}>
            <rect
              x={x}
              y={16}
              width={212}
              height={196}
              rx={8}
              fill={i > 1 ? SOFT : FILL}
              stroke={INK}
              strokeWidth={i > 1 ? 1.5 : 1}
            />
            <text x={x + 16} y={44} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
              {r.t}
            </text>
            <line x1={x + 16} y1={56} x2={x + 196} y2={56} stroke={LINE} />
            <Caption x={x + 16} y={78}>
              KEY
            </Caption>
            <text x={x + 16} y={98} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {r.k}
            </text>
            <Caption x={x + 16} y={128}>
              WHO GETS IN
            </Caption>
            <text x={x + 16} y={148} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {r.w}
            </text>
            <Caption x={x + 16} y={178}>
              REACH
            </Caption>
            <text x={x + 16} y={198} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {r.r}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// D11: gift wrap nesting
export function GiftWrap() {
  return (
    <svg
      viewBox="0 0 920 280"
      className="h-auto w-full"
      role="img"
      aria-label="NIP-17 gift wrap nesting"
    >
      <rect
        x={16}
        y={30}
        width={560}
        height={220}
        rx={10}
        fill={FILL}
        stroke={INK}
        strokeWidth={1.5}
      />
      <text x={36} y={58} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
        kind 1059 · gift wrap
      </text>
      <text x={36} y={76} fontFamily={MONO} fontSize={10} fill={MUTED}>
        signed by a throwaway key, so the relay cannot see who sent it
      </text>

      <rect
        x={56}
        y={94}
        width={480}
        height={136}
        rx={8}
        fill="#fff"
        stroke={INK}
        strokeWidth={1.2}
      />
      <text x={76} y={122} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
        kind 13 · seal
      </text>
      <text x={76} y={140} fontFamily={MONO} fontSize={10} fill={MUTED}>
        signed by your real key, encrypted to the recipient
      </text>

      <rect
        x={96}
        y={158}
        width={400}
        height={54}
        rx={6}
        fill={SOFT}
        stroke={INK}
        strokeWidth={1.2}
      />
      <text x={116} y={182} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
        kind 14 · rumor
      </text>
      <text x={116} y={200} fontFamily={MONO} fontSize={10} fill={MUTED}>
        the actual message, never signed, so it cannot be proven
      </text>

      <Caption x={624} y={44}>
        WHAT THE RELAY SEES
      </Caption>
      <Box
        x={620}
        y={58}
        w={286}
        h={44}
        label="an event"
        sub="from a key it has never seen before"
      />
      <Box x={620} y={114} w={286} h={44} label="a timestamp" sub="randomized to blur timing" />
      <Box x={620} y={170} w={286} h={44} label="ciphertext" sub="NIP-44, XChaCha20-Poly1305" />
      <text x={620} y={238} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Not your identity, not theirs,
      </text>
      <text x={620} y={254} fontFamily={MONO} fontSize={10} fill={MUTED}>
        and not a word of the message.
      </text>
    </svg>
  );
}

// D12: internet gateway
export function InternetGateway() {
  return (
    <svg
      viewBox="0 0 920 260"
      className="h-auto w-full"
      role="img"
      aria-label="Internet gateway carrying traffic for offline peers"
    >
      <Arrow id="gw-arrow" />
      <Box x={16} y={92} w={186} h={72} label="Offline phone" sub="no SIM, no WiFi" strong />
      <line
        x1={206}
        y1={128}
        x2={272}
        y2={128}
        stroke={INK}
        strokeWidth={1.3}
        markerEnd="url(#gw-arrow)"
      />
      <text
        x={239}
        y={116}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.14em"
      >
        BLE
      </text>
      <Box
        x={276}
        y={80}
        w={210}
        h={96}
        label="Gateway phone"
        sub="has internet, opted in"
        strong
      />
      <line
        x1={490}
        y1={128}
        x2={556}
        y2={128}
        stroke={INK}
        strokeWidth={1.3}
        markerEnd="url(#gw-arrow)"
      />
      <text
        x={523}
        y={116}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.14em"
      >
        TOR
      </text>
      <Box x={560} y={92} w={160} h={72} label="Nostr relays" sub="chosen by distance" />
      <line x1={724} y1={128} x2={766} y2={128} stroke={LINE} markerEnd="url(#gw-arrow)" />
      <Box x={770} y={92} w={136} h={72} label="The world" sub="location channels" />
      <text x={16} y={216} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Off by default. When you turn it on, your phone carries a neighbor&rsquo;s public location
        traffic to Nostr as packet type 0x28,
      </text>
      <text x={16} y={234} fontFamily={MONO} fontSize={10} fill={MUTED}>
        verified against its own Schnorr signature first. It never carries anyone&rsquo;s private
        messages, because it could not read them anyway.
      </text>
    </svg>
  );
}

// D13: wallet money states
export function WalletStates() {
  return (
    <svg
      viewBox="0 0 920 340"
      className="h-auto w-full"
      role="img"
      aria-label="Where a coin can be in the wallet"
    >
      <Arrow id="ws-arrow" />
      <Box x={330} y={124} w={220} h={72} label="Spendable" sub="yours, confirmed, ready" strong />

      <Box x={16} y={24} w={200} h={64} label="Deposit" sub="NUT-04 Lightning invoice" />
      <line x1={218} y1={56} x2={326} y2={140} stroke={LINE} markerEnd="url(#ws-arrow)" />

      <Box x={16} y={232} w={200} h={64} label="Withdraw" sub="NUT-05, reserve refunded" />
      <line x1={326} y1={182} x2={220} y2={252} stroke={LINE} markerEnd="url(#ws-arrow)" />

      <Box x={664} y={24} w={240} h={64} label="Reserved" sub="sent, not yet claimed" />
      <line x1={554} y1={140} x2={660} y2={60} stroke={LINE} markerEnd="url(#ws-arrow)" />
      <line
        x1={660}
        y1={72}
        x2={556}
        y2={148}
        stroke={LINE}
        strokeDasharray="4 3"
        markerEnd="url(#ws-arrow)"
      />
      <text x={604} y={112} fontFamily={MONO} fontSize={9} fill={MUTED}>
        reclaim
      </text>

      <Box
        x={664}
        y={232}
        w={240}
        h={64}
        label="Unconfirmed"
        sub="received offline, DLEQ checked"
      />
      <line x1={554} y1={182} x2={660} y2={256} stroke={LINE} markerEnd="url(#ws-arrow)" />
      <line
        x1={660}
        y1={244}
        x2={556}
        y2={174}
        stroke={LINE}
        strokeDasharray="4 3"
        markerEnd="url(#ws-arrow)"
      />
      <text x={596} y={216} fontFamily={MONO} fontSize={9} fill={MUTED}>
        Refresh, NUT-07
      </text>

      <text x={16} y={318} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Sending never deletes a coin, it moves it to Reserved. A crash, a closed app, or a message
        that never routes all leave the money recoverable.
      </text>
    </svg>
  );
}

// D14: presence states
export function PresenceStates() {
  return (
    <svg
      viewBox="0 0 920 240"
      className="h-auto w-full"
      role="img"
      aria-label="Presence states and what each does to the radios"
    >
      <Arrow id="ps-arrow" />
      <Box x={40} y={72} w={220} h={80} label="Online" sub="scanning + announcing" strong />
      <Box x={350} y={72} w={220} h={80} label="Invisible" sub="scanning, not announcing" />
      <Box x={660} y={72} w={220} h={80} label="Away" sub="radios off entirely" />
      <line x1={264} y1={100} x2={346} y2={100} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <line x1={346} y1={126} x2={264} y2={126} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <line x1={574} y1={100} x2={656} y2={100} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <line x1={656} y1={126} x2={574} y2={126} stroke={LINE} markerEnd="url(#ps-arrow)" />
      <text x={40} y={190} fontFamily={MONO} fontSize={10} fill={MUTED}>
        You see others
      </text>
      <text x={350} y={190} fontFamily={MONO} fontSize={10} fill={MUTED}>
        You see others, they do not see you
      </text>
      <text x={660} y={190} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Nothing runs, nothing relays
      </text>
      <text x={40} y={222} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Away is also what the Stop mesh button on the Android notification reaches. Panic wipe is
        the one transition with no way back.
      </text>
    </svg>
  );
}

// D15: packet frame
export function PacketFrame() {
  const fixed = [
    { w: 44, label: "ver", sub: "1" },
    { w: 44, label: "type", sub: "1" },
    { w: 44, label: "ttl", sub: "1" },
    { w: 116, label: "timestamp", sub: "8, ms" },
    { w: 52, label: "flags", sub: "1" },
    { w: 100, label: "payloadLen", sub: "4" },
  ];
  const variable = [
    { w: 104, label: "senderID", sub: "8", solid: true },
    { w: 116, label: "recipientID", sub: "8, optional" },
    { w: 96, label: "route", sub: "optional" },
    { w: 150, label: "payload", sub: "payloadLen", solid: true },
    { w: 118, label: "signature", sub: "64, Ed25519" },
  ];
  let fx = 16;
  let vx = 16;
  return (
    <svg
      viewBox="0 0 920 250"
      className="h-auto w-full"
      role="img"
      aria-label="Packet frame byte layout"
    >
      <Caption x={16} y={22}>
        FIXED HEADER · 16 BYTES
      </Caption>
      {fixed.map((f, i) => {
        const x = fx;
        fx += f.w + 4;
        return (
          <g key={i}>
            <rect
              x={x}
              y={32}
              width={f.w}
              height={54}
              rx={4}
              fill={SOFT}
              stroke={INK}
              strokeWidth={1.2}
            />
            <text
              x={x + f.w / 2}
              y={56}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={11}
              fontWeight={600}
              fill={INK}
            >
              {f.label}
            </text>
            <text
              x={x + f.w / 2}
              y={72}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={9.5}
              fill={MUTED}
            >
              {f.sub}
            </text>
          </g>
        );
      })}
      <Caption x={16} y={124}>
        VARIABLE SECTIONS · IN THIS ORDER
      </Caption>
      {variable.map((v, i) => {
        const x = vx;
        vx += v.w + 4;
        return (
          <g key={i}>
            <rect
              x={x}
              y={134}
              width={v.w}
              height={54}
              rx={4}
              fill={v.solid ? SOFT : FILL}
              stroke={v.solid ? INK : LINE}
              strokeWidth={v.solid ? 1.2 : 1}
              strokeDasharray={v.solid ? undefined : "4 3"}
            />
            <text
              x={x + v.w / 2}
              y={158}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={11}
              fontWeight={600}
              fill={INK}
            >
              {v.label}
            </text>
            <text
              x={x + v.w / 2}
              y={174}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={9.5}
              fill={MUTED}
            >
              {v.sub}
            </text>
          </g>
        );
      })}
      <text x={16} y={218} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Solid boxes are always present. Dashed boxes appear only when the matching flag bit is set.
      </text>
      <text x={16} y={236} fontFamily={MONO} fontSize={10} fill={MUTED}>
        The signature is computed over the packet re-encoded with ttl=0, so any relay can decrement
        the hop count without breaking it.
      </text>
    </svg>
  );
}

// D16: module map
export function ModuleMap() {
  const layers = [
    { label: "src/ui", sub: "shared components, theme tokens. Renders, decides nothing." },
    { label: "src/features", sub: "chat · discovery · wallet · contacts · settings · onboarding" },
    {
      label: "src/store",
      sub: "Zustand slices persisted to MMKV. wallet-store is AES-256 encrypted.",
    },
    {
      label: "src/services",
      sub: "mesh-service owns the radios. wallet-service is the only caller of a mint.",
    },
    {
      label: "src/core",
      sub: "crypto · mesh · nostr · payments · router. Pure TypeScript, no native imports.",
    },
    { label: "src/bridge", sub: "TurboModule specs. The only place native and TypeScript meet." },
    {
      label: "ios/ · android/",
      sub: "Swift and Kotlin. Advertise, scan, read bytes, write bytes. Nothing else.",
    },
  ];
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full" role="img" aria-label="Module layering">
      <Arrow id="mm-arrow" />
      {layers.map((l, i) => {
        const y = 16 + i * 54;
        const core = l.label === "src/core";
        return (
          <g key={i}>
            <rect
              x={70}
              y={y}
              width={790}
              height={44}
              rx={6}
              fill={core ? SOFT : FILL}
              stroke={core ? INK : LINE}
              strokeWidth={core ? 1.5 : 1}
            />
            <text x={90} y={y + 27} fontFamily={MONO} fontSize={12} fontWeight={700} fill={INK}>
              {l.label}
            </text>
            <text x={250} y={y + 27} fontFamily={MONO} fontSize={10} fill={MUTED}>
              {l.sub}
            </text>
          </g>
        );
      })}
      <line
        x1={40}
        y1={24}
        x2={40}
        y2={370}
        stroke={LINE}
        strokeWidth={1.2}
        markerEnd="url(#mm-arrow)"
      />
      <text
        x={30}
        y={200}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        fontWeight={700}
        fill={MUTED}
        letterSpacing="0.18em"
        transform="rotate(-90 30 200)"
      >
        DEPENDS ON
      </text>
      <text x={70} y={392} fontFamily={MONO} fontSize={10} fill={MUTED}>
        Every arrow points down and none point back up. A layer never imports from the one above it.
      </text>
    </svg>
  );
}
