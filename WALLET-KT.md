# Airhop Wallet: Knowledge Transfer

Everything about the payments side of Airhop, from first principles. Written for
someone who has never touched Bitcoin, Lightning, ecash, or "web3" terminology.
No prior knowledge assumed.

If you only read one thing, read [The 60-second version](#the-60-second-version)
and [How to test it](#how-to-test-it).

## Contents

1. [The 60-second version](#the-60-second-version)
2. [Why payments at all](#why-payments-at-all)
3. [The three layers: Bitcoin, Lightning, ecash](#the-three-layers-bitcoin-lightning-ecash)
4. [Glossary](#glossary)
5. [How ecash actually works](#how-ecash-actually-works)
6. [The mint, and why you must choose one](#the-mint-and-why-you-must-choose-one)
7. [Money in and money out](#money-in-and-money-out)
8. [Sending: the lifecycle](#sending-the-lifecycle)
9. [Receiving and claiming](#receiving-and-claiming)
10. [Nutzaps: paying over the internet](#nutzaps-paying-over-the-internet)
11. [Backup and recovery](#backup-and-recovery)
12. [Moving between mints](#moving-between-mints)
13. [Security: what is protected, what leaks](#security-what-is-protected-what-leaks)
14. [The code: file by file](#the-code-file-by-file)
15. [Every user flow, step by step](#every-user-flow-step-by-step)
16. [How to test it](#how-to-test-it)
17. [Limits, and which are permanent](#limits-and-which-are-permanent)
18. [FAQ for developers](#faq-for-developers)

## The 60-second version

A **mint** is a server that swaps Lightning bitcoin for **ecash tokens**. A token
is a string of text that is worth money to whoever holds it, like a banknote.

Airhop stores those tokens encrypted on your phone and can hand them to another
phone **over Bluetooth with no internet at all**. That is the entire point: it
works in a blackout, a protest, a dead zone.

Blind signatures mean the mint cannot see who you pay. Redeeming happens inside
Airhop, never in a browser or another app. Lightning deposits and withdrawals are
the only parts that need the internet, because Airhop is not a Lightning node.

The mint is the one thing you have to trust. You pick it, you can run your own,
and you should treat the balance like cash in your pocket rather than a savings
account.

## Why payments at all

Airhop exists for situations where normal infrastructure is unavailable:
disasters, blackouts, protests, remote areas. In exactly those situations, card
networks and banking apps are also down.

Every mainstream payment system needs a live connection to a server at the moment
of payment. Ecash does not. That is why it is here, and it is why the design
prioritises the offline path over everything else.

## The three layers: Bitcoin, Lightning, ecash

### Bitcoin

A public ledger. Roughly ten minutes per block, every transaction visible forever,
a fee per transaction. Excellent as a settlement layer, terrible for buying
coffee.

**Sats** (satoshis) are just the small unit. 1 bitcoin = 100,000,000 sats. Airhop
denominates everything in sats because they are a sensible size for a
message-sized payment.

### Lightning

A network built on top of Bitcoin. Instead of writing every payment to the
ledger, people open payment channels and settle instantly between them. Fast,
cheap, works for tiny amounts.

A Lightning payment is requested with an **invoice**: a long string starting with
`lnbc...`. Someone generates one saying "pay me 500 sats", you pay it, done in a
second.

**But Lightning needs the internet.** Both ends must be online at the same moment
and routing happens live. In a blackout, Lightning is dead. Which is a problem,
because that is exactly when Airhop is supposed to work.

### Cashu (ecash)

The layer that solves the offline problem, and what Airhop actually uses.

Cashu is **digital cash**. Not a ledger, not a network. A token is a _string of
text_ worth money to whoever holds it. You can send a string over Bluetooth. You
can read it aloud. You can write it on paper.

**Handing someone the string is handing them the money.** No internet, no server,
no confirmation, no counterparty being online.

## Glossary

Plain-English definitions of every term you will hit in the code or the UI.

| Term                  | What it means                                                                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **sat**               | Satoshi. 1/100,000,000 of a bitcoin. The unit Airhop counts in.                                                                                       |
| **mint**              | The server that issues and redeems ecash and holds the real bitcoin. The one trust point.                                                             |
| **proof**             | One ecash coin. An amount, a secret, and the mint's signature over that secret.                                                                       |
| **secret**            | A random string only the coin's owner knows. Whoever knows it owns the coin.                                                                          |
| **token**             | One or more proofs packed into a single text string. What actually moves between people. Starts with `cashuB`.                                        |
| **keyset**            | The mint's set of signing keys, one per denomination. Airhop caches the public half so it can verify tokens offline.                                  |
| **denomination**      | Coins come in powers of two (1, 2, 4, 8, 16...). This is why exact amounts are sometimes impossible.                                                  |
| **swap**              | Trading proofs at the mint for fresh ones with new secrets. What makes a received coin truly yours.                                                   |
| **mint (verb)**       | Turning Lightning sats into ecash. "Deposit" in the UI.                                                                                               |
| **melt**              | Turning ecash back into a Lightning payment. "Withdraw" in the UI.                                                                                    |
| **blind signature**   | The mint signs your coin without seeing the secret, so it cannot later link issuance to spending.                                                     |
| **DLEQ**              | A small proof attached to a coin letting your device verify the mint signed it, with no network.                                                      |
| **P2PK**              | "Pay to public key". A coin locked so only one specific key can spend it. Used by nutzaps.                                                            |
| **nutzap**            | Paying a Nostr identity over the internet with P2PK-locked ecash (NIP-61).                                                                            |
| **bolt11**            | The standard Lightning invoice format. The `lnbc...` string.                                                                                          |
| **NUT**               | A Cashu spec document. "Notation, Usage, and Terminology". NUT-04 is deposits, NUT-05 is withdrawals, and so on. Numbered chapters, nothing mystical. |
| **NIP**               | The same idea for Nostr. NIP-61 is nutzaps.                                                                                                           |
| **BIP-39**            | The standard for turning random entropy into 12 memorable words. Your recovery phrase.                                                                |
| **bearer instrument** | Something where possession equals ownership. Cash, a cinema ticket, an ecash token.                                                                   |

### Terms you will _not_ find here

Airhop's payments involve **no blockchain transactions, no smart contracts, no
tokens in the crypto-asset sense, no wallet-connect, no gas fees, and no
accounts**. If you came expecting Ethereum-style plumbing, none of it applies.
Cashu is closer to a 1990s digital-cash paper than to anything sold as "web3".

## How ecash actually works

### What a coin is

Three parts:

```
proof = {
  amount:  8                   // always a power of two
  secret:  "a91f3e..."         // random string only you know
  C:       "02b4c9..."         // the mint's signature over that secret
}
```

The mint holds the real bitcoin. It has **no idea who owns what**. It only keeps
a list of "secrets that have been spent". Show up with a secret it signed and has
not seen spent, and it pays out.

**If you lose the secret, the money is unreachable.** Not stolen, not refundable.
The bitcoin sits at the mint forever because nobody can prove they own it. This
is why [backup](#backup-and-recovery) exists.

### Blind signatures: why the mint cannot spy

This is the clever part and the whole privacy story.

When the mint signs your coin, **it never sees the secret**. You blind it first,
mathematically. The intuition: you put a document in an envelope lined with
carbon paper, the mint signs the outside, and the signature comes through onto a
document it never read.

So later, when someone redeems that coin, the mint verifies its own signature but
**cannot tell which customer it was originally issued to**. The link between "who
deposited" and "who spent" is severed by maths, not by policy.

That is privacy a bank account can never offer.

### Why denominations are powers of two

Coins come in 1, 2, 4, 8, 16, 32, 64... so any amount can be assembled from a
handful of them. 100 = 64 + 32 + 4.

The consequence you will feel: sometimes you cannot make an exact amount, for the
same reason you cannot make £7 from a £5 note and a £10 note without change. And
offline, **there is no change**, because making change requires the mint. Airhop
detects this, tells you the smallest token it can build, and makes you confirm
before overpaying.

## The mint, and why you must choose one

**Airhop is a wallet, not a bank.** It holds your coins; it does not issue them.
Someone has to hold the actual bitcoin, and that someone is the mint.

Think of a casino cashier's desk. You hand over cash, you get chips. The chips
move around the floor with nobody watching. Anyone can bring chips back to the
desk for cash.

### The honest trade-off

**What you get:** payments with no internet, no account, no ID check, no way for
the mint to see who you paid.

**What you give up:** the mint could vanish with the money. It is a custodian.

It is a _limited_ custodian, though. It cannot see who you are, who you pay, or
link deposits to spends, so it cannot single you out or freeze one person's
funds. But it is holding the bitcoin.

### How Airhop limits the damage

- **No default mint ships.** Nothing is chosen for you.
- **The URL is validated before it is saved**, so a typo or a dead host is
  rejected up front rather than failing on first use.
- **Plain `http://` is refused** except on localhost, since that would send proofs
  over an unauthenticated channel.
- **Balances are per (mint, unit) and never pooled**, so one mint failing cannot
  take the rest.
- **You can run your own.** Nutshell is the reference implementation; a Raspberry
  Pi is enough.

### One behaviour to know about

If you receive a token from a mint you have never added, **Airhop adds that mint
automatically** so the money is usable. That is the right default (otherwise the
money would be stuck) but it means your mint list can grow with mints you never
chose. Worth surfacing to users eventually.

## Money in and money out

These are the only two parts that need the internet, and the only two that
involve another app, because **Airhop is not a Lightning node**.

### In: minting (NUT-04)

```
You tap Deposit, enter 1000 sats
        │
        ▼
Mint returns a bolt11 invoice
        │
        ▼
You pay it from any Lightning wallet   ← the only external app involved
        │
        ▼
Mint sees it paid, issues 1000 sats of proofs
```

Airhop polls while the sheet is open. Close the app mid-flight and `reconcile()`
picks it up on next launch, so a half-finished deposit is never lost.

### Out: melting (NUT-05)

```
Paste a bolt11 invoice into Withdraw
        │
        ▼
Quote: amount + routing reserve        ← shown before anything is spent
        │
        ▼
You confirm; the mint pays the invoice
        │
        ▼
Unused reserve comes back as change proofs
```

The **routing reserve** is an upper bound on the Lightning network fee. Whatever
routing does not consume is returned, which is why the UI says "up to".

## Sending: the lifecycle

This is the most important part of the design, so it is worth understanding
precisely.

### What happens when you send 100 sats

```
1. QUOTE      pick proofs that cover 100, plus the mint's fee
              → "you spend 101, they receive 100"

2. RESERVE    proofs MOVE to a reserved bucket
              → they leave your spendable balance (no double-spend)
              → they are NOT deleted

3. SERIALISE  pack them into one cashuB... string

4. DELIVER    mesh DM / share sheet / clipboard

5. SETTLE     one of four things happens
```

### Step 5, in detail

| Outcome                       | What happens                                      |
| ----------------------------- | ------------------------------------------------- |
| You tap **"They got it"**     | Reservation dropped. Done.                        |
| You tap **Reclaim**           | Proofs return to your balance.                    |
| You do nothing                | Stays under **Pending**. Survives app restart.    |
| `reconcile()` sees them spent | Auto-completes, because the money really is gone. |

### Why this matters

Before this design, proofs were **deleted** the instant the token was built.
Close the sheet without sharing, crash, or have the Bluetooth message fail to
route, and the money was gone with no trace and no recovery.

Now nothing is destroyed until delivery is confirmed. **This is the single most
important correctness property in the wallet.**

### The one caveat, which the UI states before you tap

Reclaiming races the recipient. If they already have the token string, whoever
reaches the mint first keeps the money, and that could be them.

### Fees: why "send 100" means they get 100

Under NUT-02 the mint charges the **recipient** an input fee when they swap. So
naively sending exactly 100 leaves them with less than 100.

Airhop selects enough to cover that fee, which is what every production Cashu
wallet does. The generated-token sheet shows both numbers when they differ.

### Where you can send from

Four entry points, all running **identical code** via `payPerson` in
`src/services/ecash-transfer.ts`:

- **Chat** → inside a DM, attach menu → "Send ecash"
- **Contact sheet** → tap the DM header → "Send ecash"
- **Mesh tab** → tap a peer → "Send sats"
- **Wallet tab** → **Zap** (pays a Nostr identity), or build a token and
  share / copy / pick a nearby peer

Before the refactor each screen open-coded its own version and each got it
slightly wrong (one used a hard-coded `"local"` sender id, none warned about
inexact amounts, none attached a message id for delivery tracking). Zap was
worse: it lived on a second implementation entirely, which is where the
double-reserve bug lived.

The first three share one sheet component (`send-ecash-sheet.tsx`). Zap keeps
its own inputs because it is the only door that addresses an identity rather
than a conversation, but it calls the same `payPerson` underneath.

## Receiving and claiming

### What the recipient sees

The token arrives as a message. Airhop detects it and renders a **payment card**
with the amount, mint and memo, plus a Claim button. The raw string is hidden,
because 400 characters of base64 is not a useful thing to look at.

### Airhop does NOT open a browser or another wallet

This is a deliberate difference from bitchat, which only _displays_ Cashu tokens
and hands them off to an external wallet app or the `redeem.cashu.me` website.

**Airhop implements the wallet itself**, so the token never leaves the device and
no third party ever sees it.

### Online: swap immediately

Airhop contacts the mint over HTTPS and performs a **swap**: it trades the
received proofs for brand new ones with brand new secrets only you know.

This matters for a non-obvious reason. **The sender still has a copy of the token
string.** Until you swap, they could spend it out from under you. After the swap,
their copy is dead.

> Swapping is what turns "someone gave me a token" into "this is my money."

### Offline: store and flag honestly

Two things happen:

**1. The signature is verified offline.** Using the mint's cached public keys,
Airhop checks the **DLEQ** proof attached to each coin. This confirms the mint
really signed it. A forged token is **rejected outright** and never touches your
balance.

**2. The money is marked unconfirmed.** Your balance shows it, but with a
separate line: _"X sats not yet confirmed with the mint."_ Refresh when online and
the line clears.

### The limit you must internalise

> **A valid signature proves the mint issued that coin.
> It can NEVER prove the coin is unspent.**

Someone can hand you a genuine, correctly signed token they already spent five
minutes ago. No cryptography detects this offline. Only the mint knows.

This is not an Airhop weakness. It is a property of bearer instruments: a genuine
banknote can also have been promised to someone else. Airhop's job is to be
honest that it does not know yet, which is exactly what the unconfirmed line does.

**Practical advice:** for a stranger, redeem before handing over goods. For a
friend, it does not matter.

## Nutzaps: paying over the internet

A **nutzap** (NIP-61) pays a Nostr identity directly with ecash.

The difference from a normal token: the sender **locks the coins to the
recipient's public key** (P2PK). It is a token only they can open, which is what
makes it safe to publish in a public event.

### Why involve Nostr at all? Isn't ecash enough?

Ecash solves **value**. It does not solve **addressing**.

Every other way Airhop moves money needs a _channel to the person_ that already
exists:

| Path      | What it needs                             |
| --------- | ----------------------------------------- |
| Bluetooth | You are physically near them, right now   |
| DM        | You already have a conversation with them |
| QR        | You are both looking at the same screen   |

All three answer "how do I hand this over". None answer **"how do I pay someone
I cannot reach"**.

That is the gap Nostr fills. A Nostr identity is a public key that anyone can
address without permission, registration, or any prior contact, and relays are
public noticeboards that hold a message until the recipient looks. Put those
together and you can leave money _addressed to an identity_ rather than handed
to a person.

Concretely, three things become possible that ecash alone cannot do:

1. **No channel needed.** Someone posts something useful in a public location
   channel, relayed in from three hops away. Not a contact, not in range, no DM
   thread. Their public key is right there on the message. A zap is the only way
   to pay them.
2. **They can be offline.** A DM needs them to eventually receive and open it.
   A nutzap sits on relays indefinitely and is collected whenever they next open
   any device.
3. **Other apps can pay you.** This is the big one. NIP-61 is a standard, so a
   user of Amethyst or a different Cashu wallet can zap an Airhop user and vice
   versa. The encrypted-DM fallback is effectively Airhop-to-Airhop. Nutzap is
   how the payment side joins the wider network instead of being an island.

It is the same argument as BLE wire compatibility with bitchat, applied to
money: do not invent a private protocol when a public one already exists.

**Why the coins must be locked.** A relay is public, so the event carrying the
coins is readable by anyone. If it held a plain bearer token, the first person
to read it would take it. P2PK locks the coins to the recipient's key, which is
what makes publishing money in the open safe at all.

### Where your npub lives, and what it means

**Wallet → Receive → "Your Nostr key".** Tap it to copy.

That string is your Nostr public identity. It is derived from the same root as
the rest of your identity, so there is no registration, no server, and nothing
to sign up for. It is not a secret, and it is not linked to a phone number or an
email.

What it means for you in practice:

- **It is your payment address for the internet path.** Bluetooth needs
  proximity; your npub needs nothing. Give it to someone once and they can pay
  you from anywhere, forever, from any Nostr wallet.
- **Airhop already announced it.** At launch the app publishes a NIP-61 kind
  10019 record saying which mints you use, so other wallets know _how_ to pay
  you and not just _who_ you are. This only happens once you have at least one
  mint, which is why a fresh install with no mint cannot be nutzapped and
  receives the DM fallback instead.
- **It is public, permanently.** That record, and every nutzap sent to you, is
  visible to relays and anyone watching. The coins stay safe because they are
  locked to you, but the _fact_ of payment is not private. This is the one place
  Airhop trades privacy for reach, and it is why the offline paths exist.

If your contacts came from a scanned contact card, Airhop already knows their
Nostr key, and the Zap sheet offers them as chips so you never type an npub by
hand.

### Airhop picks a rail and tells you which one, from every door

This ladder is not Zap-specific any more. Every payment, from every entry point,
walks the same four rungs:

| #   | Rail       | When                                                                                                           | Reclaimable |
| --- | ---------- | -------------------------------------------------------------------------------------------------------------- | ----------- |
| 1   | **Radio**  | A direct BLE / Wi-Fi link exists right now                                                                     | Yes         |
| 2   | **Nutzap** | No radio link, you know their Nostr key, they published a kind 10019, and you hold value at a mint they accept | **No**      |
| 3   | **Token**  | Anything else. `sendDm` picks Nostr gift-wrap, a courier, or the outbox                                        | Yes         |
| 4   | **Manual** | Nothing carried it. The string comes back for you to hand over                                                 | Yes         |

**Radio comes first on purpose.** Someone standing in front of you should not
wait on a mint round trip to build a fancier instrument, and the in-person case
has to keep working with no internet at all.

**Rail 2 beats rail 3 when it is available**, because locked coins are
definitively theirs whether or not they ever come online, where a bearer token is
only theirs once they claim it. That is why paying from a chat thread can now
produce a nutzap: before, the good rail was hidden in a different tab.

**Only rail 2 is final.** Its coins are locked to the recipient's key and are not
yours to take back, so Pending will not offer a reclaim. Every confirmation says
which rail carried the money and whether you can still stop it. The old
implementation silently downgraded and reported success either way.

Two invariants hold across the whole ladder:

- **One commitment per payment.** Either coins are reserved (rails 1, 3, 4) or
  P2PK-locked (rail 2), never both. A rail that fails _before_ committing falls
  through to the next; a rail that fails _after_ committing only retries
  delivery. A relay timeout used to fall through after committing, which reserved
  a second set of coins for the same payment: send 500 on bad wifi and 1000 left
  your balance.
- **Finality is reported, never inferred.**

### Which relays a nutzap goes to

**Theirs, from their kind 10019.** Not ours. NIP-61 is explicit about this and it
matters more than it looks: the recipient subscribes to their own relay set, so
publishing to ours instead puts the payment somewhere they never look.

This was wrong for a long time and was invisible, because two Airhop users share
a default relay pool, so it always appeared to work. Against any other NIP-61
wallet on a different relay set, the payment was published, locked to them, and
never seen. If you are testing interop with Amethyst or another Cashu wallet,
this is the first thing to sanity-check.

### Receiving

`startNutzapWatcher` runs in the background, redeems incoming zaps automatically,
and alerts you. Redeemed event ids are remembered so a relay replaying old events
cannot credit you twice.

If the relay refuses the kind 9321, the locked coins are delivered to the
recipient as a token in a message instead. Those coins are P2PK-locked, so
claiming them needs the recipient's own key: `receiveToken` passes it on every
claim. Without that the mint refuses the swap and the money is stuck in the gap,
unclaimable by them and unreclaimable by the sender.

### Privacy caveat worth repeating

**A nutzap is a public event.** The coins are locked so nobody else can spend
them, but relays and observers see that pubkey A paid pubkey B, and the amount.
The encrypted-DM fallback is the opposite: metadata-private, but the token is a
bearer instrument once decrypted.

## Backup and recovery

**Off by default.** Turning it on is a commitment: the user has to write twelve
words down and keep them.

### The problem it solves

By default every coin's secret is fresh random bytes. The only copy that has ever
existed is on this phone. Lose the phone and the money is unreachable forever.

### How it works

With a recovery phrase, secrets stop being random. They are **derived** from one
master seed in a fixed order (**NUT-13**):

```
seed + keyset + counter 0  →  secret #0
seed + keyset + counter 1  →  secret #1
seed + keyset + counter 2  →  secret #2
...
```

Recovery (**NUT-09**) re-derives them on any device and asks the mint _"did you
sign this one? this one? this one?"_ The mint answers from its own records and
the balance reassembles out of nothing but twelve words.

### What it does and does not cover

|                                       |                                         |
| ------------------------------------- | --------------------------------------- |
| Ecash derived from the phrase         | ✅                                      |
| At mints you re-add                   | ✅                                      |
| Your Airhop identity, chats, contacts | ❌ no backup exists at all              |
| Which mints you used                  | ❌ shown beside the words to write down |
| Coins received and never swapped      | ❌ they carry the _sender's_ secrets    |

That last row is subtle and the UI states it: coins someone gave you are outside
your phrase until a swap re-issues them under it. The card shows exactly how much
falls into that category, and Refresh fixes it.

### Three honesty properties

**The keychain is the source of truth.** If the flag says backup is on but the
phrase is gone (keychain reset, device restore that did not carry keychain
items), startup turns the flag off rather than claiming coverage you do not have.

**"Unconfirmed" is its own state.** See the words but bail before the check and
the card reads **Unconfirmed** in red, not On. A phrase that exists but was never
written down is the worst possible state, because the wallet looks protected and
is not. Tapping "View phrase" from there reopens the write-it-down flow.

**It is one-way.** There is no "turn backup off", because deleting a phrase your
coins were derived from is indistinguishable from deleting the coins. Only the
panic wipe removes it.

### Counters: the one thing that can go wrong

Re-deriving a counter recreates a secret the mint has already signed, and the
swap is rejected as a duplicate.

Mitigations:

- The cursor is persisted per keyset and only ever moves forward.
- Restore pushes it past everything the mint has on record.
- Reads and writes are synchronous in one function body, so two concurrent
  callers cannot get the same range.

**A rejected swap leaves the input proofs untouched**, so the failure mode is a
retry, never a loss.

## Moving between mints

### The permanent limit

A token names **exactly one mint**. Ecash from two mints can never be combined
into a single token.

With 60 sats at mint A and 60 at mint B, you cannot send 100, even though the
total says 120. **This is Cashu's design and is not something an app can work
around.**

### What Airhop can do

Move the value. The destination mint issues a Lightning invoice and the source
mint pays it:

```
mint B issues an invoice for N
        │
        ▼
mint A pays it over Lightning       ← one routing fee
        │
        ▼
mint B issues N sats of proofs to you
```

One tap, versus the five-step manual dance (external wallet, two invoices, two
routing fees) it replaces.

The awkward part is sizing: the fee reserve is only known after quoting, quoting
needs an invoice, and an invoice needs an amount. The implementation quotes,
checks whether the total fits, shrinks and retries at most twice, and marks
abandoned invoices expired so they do not linger as phantom pending deposits.

## Security: what is protected, what leaks

### Over Bluetooth (the offline path)

|                  |                                       |
| ---------------- | ------------------------------------- |
| Encryption       | Noise XX + Double Ratchet, end to end |
| Who can read it  | Only the two of you                   |
| Relaying phones  | Carry ciphertext, cannot read it      |
| Servers involved | **None**                              |
| Mint involvement | **None**                              |

**This path leaks nothing.** No server sees it, no relay sees it, the mint does
not even know the payment happened. It is the strongest thing in the system.

**Exception:** a token posted to a **public channel** is in the open. Anyone
reading the channel can redeem it, first come first served. Inherent to bearer
tokens, not a flaw. The UI says so.

### To the mint

**Sees:** your IP address, deposit and withdrawal amounts, timing.

**Cannot see:** who you are, who you paid, who paid you, or any link between the
coins you deposited and the ones you spend. Blind signatures make that
mathematically impossible.

The IP is the weak point, which is why Tor matters here.

### Tor

| Platform    | Status                                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Android** | Orbot runs as a VPN and covers everything, mint traffic included. Fully protected.                                                                                       |
| **iOS**     | Tor only covers the Nostr WebSocket. Mint requests would bypass it, so **Airhop blocks them** and explains why, with an opt-in switch beside the Tor toggle in Settings. |

**Mesh ecash never touches the mint**, so sending and receiving to people near you
always works with Tor on, on both platforms.

The dangerous version of this bug is dead: previously the request went out anyway
and the mint quietly logged the user's IP next to their coins.

### To Nostr relays

Only nutzaps touch relays, and **a nutzap is a public event**. See
[Nutzaps](#nutzaps-paying-over-the-internet).

### On your phone

Proofs live in an **AES-256 encrypted MMKV file**, keyed from the iOS Keychain /
Android Keystore. If the keychain cannot be opened the wallet **locks** rather
than falling back to plaintext. Panic wipe deletes the file and destroys the key.

## The code: file by file

```
src/core/payments/
  cashu.ts          Pure, offline. Token detection, decoding, DLEQ
                    verification, fee maths, proof selection, serialisation.
                    No network, no state.
  nutzap.ts         NIP-61 event construction and parsing. Pure.
  wallet-seed.ts    BIP-39 phrase generation, validation, keychain storage.

src/store/
  wallet-store.ts   Encrypted persistence. Proofs by (mint, unit), reserved
                    bucket, mint registry, transaction history, NUT-13
                    counters. No network.

src/services/
  wallet-service.ts The ONLY place that talks to a mint. Owns every rule that
                    protects money: reservations, DLEQ enforcement, the Tor
                    guard, unit isolation, Lightning, restore, consolidate.
  ecash-transfer.ts Shared "send to a mesh peer" flow used by all three screens.

src/features/wallet/
  wallet-screen.tsx Presentation only. Does no proof arithmetic of its own.
```

### The layering rule

**`core/` is pure and offline. `services/` owns the network and the rules.
`features/` is presentation.**

The wallet screen deliberately does no proof arithmetic, because the same logic
runs from the DM thread and the peer sheet and the three must not drift.

### Guarantees the service provides

1. Proofs are never deleted to send, only moved to a reserved bucket.
2. Nothing is credited without either a mint swap or a passing DLEQ check.
3. A mint call is never made silently over the clear net while Tor is on (iOS).
4. Units are never mixed. A (mint, unit) pair is one account.

## Every user flow, step by step

### First run

```
Wallet tab → empty state → "No mint yet"
  → header + → paste mint URL → validated → saved with cached keys
  → Lightning → Deposit → amount → invoice → pay externally → balance
```

### Paying someone standing next to you, no internet

```
Mesh tab → tap peer → Send sats → amount
  → (if inexact) confirm the overpayment
  → token built, proofs reserved, DM sent over Bluetooth
  → Wallet tab → Pending → "They got it" once confirmed
```

### Being paid, no internet

```
Chat → payment card appears → Claim
  → DLEQ verified against cached mint keys
  → stored, balance shows "X not yet confirmed"
  → later, online → Wallet → Refresh → line clears
```

### Setting up backup

```
Wallet → Backup → Set up
  → warning screen (what it is, what it does not cover)
  → 12 words shown in a numbered grid
  → "I have written them down"
  → asked for two randomly chosen words
  → card reads On
```

### Recovering on a new phone

```
Install → Wallet → add the same mint(s)
  → Backup → Restore → paste 12 words
  → scans every keyset at every mint
  → reports recovered / already-spent / unreachable
```

### Cashing out

```
Generate an invoice in any Lightning wallet
  → Airhop → Lightning → Withdraw → paste
  → quote shows amount + routing reserve
  → confirm → paid, unused reserve returned as change
```

## How to test it

### Setup

You need a mint. Use **`https://testnut.cashu.space`**, the community test mint.
It issues free play-money sats, so every flow below can be exercised with
nothing at risk. It advertises NUT-04, 05, 07, 09, 11 and 12, which covers
everything Airhop uses including restore.

The sats are not real and the mint is wiped periodically. That makes it perfect
for testing and useless for anything else.

For real sats, use a publicly run mint. [bitcoinmints.com](https://bitcoinmints.com)
tracks who is running what.

### Single device, about ten minutes

| #   | Do this                                           | Expect                                                         |
| --- | ------------------------------------------------- | -------------------------------------------------------------- |
| 1   | Add a mint                                        | Row shows its name and unit                                    |
| 2   | Deposit 100 sats, pay the invoice                 | Balance appears, **not** flagged unconfirmed                   |
| 3   | Send 10, then **close the sheet without sharing** | Appears under **Pending**                                      |
| 4   | Reclaim it                                        | Balance back to 100. _This is the bug that used to eat money._ |
| 5   | Send 10 → Copy → Receive → paste it back          | "Already claimed", not a phantom +10                           |
| 6   | Send 3 when you only hold powers of two           | Inexact warning with the real overpayment                      |
| 7   | Withdraw to an invoice                            | Quote breakdown, then change returned                          |
| 8   | Zap your **own** npub with relays unreachable     | **One** pending entry, not two. Balance drops once             |

Row 8 is the double-reserve regression. Before the fix, a relay that accepted the
connection and then never answered made the wallet reserve a second set of coins
for the same payment: your balance dropped by twice the amount and Pending showed
two rows for one zap. The quickest way to force it is airplane mode on _after_
the app has connected, or a bogus relay in settings.

### Backup

| #   | Do this                                                 | Expect                                                    |
| --- | ------------------------------------------------------- | --------------------------------------------------------- |
| 1   | Backup → Set up → complete the word check               | Card reads **On**                                         |
| 2   | Repeat but bail at the words                            | Card reads **Unconfirmed** in red                         |
| 3   | Tap View phrase from that state                         | Reopens the write-it-down flow, not read-only             |
| 4   | Receive a token from another device                     | Card shows "not covered yet"                              |
| 5   | Refresh                                                 | Line clears, message names it separately from "confirmed" |
| 6   | **Panic wipe, re-add mint, Restore with the words**     | Balance comes back                                        |
| 7   | Try restoring a _different_ phrase over an existing one | Warns before replacing                                    |

### Two devices (the real test)

1. Both on the same mint. A sends B 20 sats from the Mesh peer sheet.
2. B: payment card in the DM → Claim. Online → "provably yours".
3. **Airplane mode both first** → "stored, not yet confirmed", B's balance shows
   the unconfirmed line.
4. B goes online → Refresh → line clears, swap appears in Activity.
5. **Double-spend check:** A sends B a token, then _before B claims_, A reclaims
   and spends it elsewhere. B's claim should fail with "already spent" rather than
   crediting.

### Zapping between two users (the internet path)

Unlike everything above, this one needs **internet on both sides**. Bluetooth is
irrelevant here; the two phones never talk to each other directly.

**Setup:** both devices add the same mint (`https://testnut.cashu.space` is
free), and A holds a balance. B must have at least one mint added, otherwise B
has no kind 10019 published and every zap to them falls back to a DM.

1. **B copies their npub.** Wallet → Receive → tap **Your Nostr key**. Send it
   to A by any means at all, including a different app.
2. **A zaps.** Wallet → **Zap** → paste B's npub → amount → send. If A and B
   have exchanged contact QR cards, B appears as a chip instead and no pasting
   is needed.
3. **Read which tier fired.** A is told explicitly: a true nutzap, an encrypted
   DM fallback, or a manual token. This is the single most useful thing to watch,
   because a silent downgrade is exactly the bug this design exists to prevent.
4. **B receives with no action.** `startNutzapWatcher` picks the event up,
   redeems it, and alerts. B does not tap Claim; that is the difference from the
   Bluetooth path.
5. **Check both Activity lists.** A shows `nutzap-out` in red, B shows
   `nutzap-in` in green.

**Scenarios worth forcing, because each exercises a different fallback:**

| Do this                               | Expect                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| B has **no mint** added               | A is told it went as an encrypted DM, not a nutzap. B claims it manually.                   |
| B is **fully offline** when A zaps    | Nothing is lost. B opens the app later, the watcher finds it, it redeems.                   |
| Kill B's app mid-redeem, reopen       | Redeems once. `redeemedNutzaps` remembers event ids, so a relay replay cannot credit twice. |
| A is in **airplane mode**             | Zap fails cleanly with a reason. Nothing is deducted.                                       |
| A has **Tor on (iOS)**                | Blocked with an explanation rather than leaking mint traffic outside Tor.                   |
| Zap an npub that has never used ecash | Falls back to DM. If they are not on Airhop either, A is left holding a reclaimable token.  |

**What this proves that the Bluetooth test does not:** money reached someone
with no proximity, no prior conversation, and no action on their part, and the
coins were locked so the public relay carrying them could not be robbed.

### The rail ladder (what changed most recently)

Payments used to behave differently depending on which screen you started from.
They no longer do, and these are the checks that prove it. All four doors should
produce the same confirmation wording, differing only in the rail named.

| #   | Do this                                                                                  | Expect                                                                                         |
| --- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1   | Pay a peer **in BLE range** from the Mesh peer sheet                                     | "Handed straight to their device over the mesh", reclaimable. **No mint round trip**, no delay |
| 2   | Same peer, same door, with the phone in **airplane mode**                                | Identical result. The radio rail must not need internet                                        |
| 3   | Pay a contact who is **out of range but has published a 10019**, from the DM attach menu | A **nutzap**, and the confirmation says it cannot be reclaimed                                 |
| 4   | Same contact, from the **contact info sheet** (tap the DM header)                        | Byte-identical outcome to row 3. One sheet, one ladder                                         |
| 5   | After row 3, look at the DM thread                                                       | A centered grey note: "You sent N sat, locked to their key." Not a bubble: nothing was sent    |
| 6   | Zap an npub that **is already a saved contact**                                          | The receipt lands in your **existing** thread with them, not a new npub thread                 |
| 7   | Zap a **stranger's** npub                                                                | No DM thread is created. It belongs in wallet history only                                     |
| 8   | Pay someone with **no 10019**, out of range                                              | Token rail, reclaimable, and the reason names the missing 10019                                |

### Cross-app: bitchat

bitchat has **no wallet and no NIP-61**. It decodes tokens only far enough to
draw a payment chip and delegates redemption to an external wallet, and it has
neither kind 10019 nor kind 9321. So the contract between the two apps is exactly
one thing: **a message whose body is a Cashu token string**.

| Do this                                         | Expect                                                                       |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| Airhop → bitchat, send ecash in a DM            | bitchat renders a payment chip with the right amount, unit and mint host     |
| bitchat → Airhop, `/pay <token>` in a DM        | Airhop shows a claim card. Tap Claim, it swaps                               |
| Airhop → a bitchat user, out of range           | Falls to the **token** rail, never nutzap. bitchat can never publish a 10019 |
| Send a `cashu:`-prefixed or `cashuA` (v3) token | Both sides strip the URI form and accept v3 and v4                           |

`src/core/payments/__tests__/bitchat-token-compat.test.ts` pins this: it runs a
faithful port of bitchat's own `CashuTokenDecoder` CBOR walk over a token built
by Airhop's encoder. If cashu-ts ever emits a shape their minimal reader cannot
follow, that test fails rather than payments silently becoming unreadable blobs.

**Do not rename the `bitchat1:` envelope.** Airhop's Nostr DMs carry a
`bitchat1:` prefixed packet inside the NIP-17 gift wrap, and bitchat's inbound
pipeline drops anything without that exact prefix
(`NostrInboundPipeline.swift`: "Ignoring non-embedded Nostr DM content"). Airhop
does the identical thing. Renaming it to `airhop1:` would break **every** DM
between the two apps, text and payments alike, in both directions, with no error
shown to either user. It is a shared wire identifier, not a branding string.

### What the simulator already proves

`src/services/__tests__/sim/tier-wallet.test.ts` runs these against a real BDHKE
mint (real blinding, real DLEQ, a real spent-set), so they fail for real reasons.
Run with `npx jest tier-wallet`.

| ID  | What it pins                                                                          |
| --- | ------------------------------------------------------------------------------------- |
| W01 | Deposit over Lightning issues verifiable, DLEQ-checked ecash                          |
| W02 | Ecash moves device to device with the radio off, redeemed later                       |
| W03 | The same token cannot be redeemed twice                                               |
| W04 | An undelivered send is reclaimable, not lost                                          |
| W05 | A mint that dies mid-swap does not destroy the input proofs                           |
| W06 | A locked nutzap delivered late stops showing as pending once the mint confirms it     |
| W07 | **Nutzap end to end**: 10019 discovery, P2PK lock, kind 9321, automatic redemption    |
| W08 | **Withdraw**: routing reserve quoted, unused part returned as change (NUT-08)         |
| W09 | **A failed Lightning payment gives the money back**, spendable, and a retry works     |
| W10 | **Recovery**: twelve words restore a wiped phone, and spending still works after      |
| W11 | **A withdrawal whose answer never arrives** is reconciled from the quote, not guessed |
| W12 | **Consolidate**: a split balance moves onto one mint, losing only the real fee        |
| W13 | **Tor on iOS** refuses mint traffic rather than leaking it, offline paths unaffected  |

Alongside them, at unit level:

| File                           | What it pins                                                           |
| ------------------------------ | ---------------------------------------------------------------------- |
| `pay-person.test.ts`           | Rail selection, one-commitment-per-payment, relay targeting            |
| `mint-network-gate.test.ts`    | Tor blocks on iOS, does NOT block on Android, and the opt-in override  |
| `scan.test.ts`                 | What a scanned QR is allowed to mean, token vs invoice, network prefix |
| `bitchat-token-compat.test.ts` | Airhop tokens decode under bitchat's own CBOR reader                   |
| `mint-fabric.test.ts`          | The simulated mint agrees with cashu-ts about hash_to_curve            |
| `ecash-reclaim.test.ts`        | Reclaim cancels every copy: proofs, bubble, outbox                     |

W09, W10 and W11 are the ones that matter most for trust. A mint that burns your
proofs on a payment it never routed has eaten your money. A restore that brings
the balance back but leaves the derivation counter behind looks fine until the
first time you try to spend, which is the worst moment to find out. And a melt
whose response is lost is the case where guessing in EITHER direction is wrong:
release the coins and the user spends money the mint already burned, drop them
and the unused routing reserve is gone. Only the quote knows, so only the quote
is asked.

### Offline / airplane mode

Everything except deposit, withdraw, refresh and zap must work with no radios:
send, receive, claim, balance, fee maths, DLEQ verification. **This is the core
promise, so hammer it.**

### Tor

- **iOS:** mint buttons grey out, banner explains, Settings has the opt-in.
- **Android + Orbot:** everything keeps working.
- **Both:** mesh ecash unaffected.

### Multi-mint

Hold a balance at two mints → the split-balance row appears → Move → one mint
holds it all.

## Limits, and which are permanent

### Permanent (protocol or platform)

| Limit                                 | Why                                                      |
| ------------------------------------- | -------------------------------------------------------- |
| One token = one mint                  | Cashu's design. No merging across mints, ever.           |
| DLEQ cannot prove "unspent"           | Only the mint knows. No offline cryptography fixes this. |
| A token in a public channel is public | Bearer means bearer.                                     |
| Reclaim races the recipient           | Both hold the string; first to the mint wins.            |
| iOS Simulator has no Bluetooth        | Mesh ecash needs two physical devices.                   |

### Fixable, not yet done

| Gap                       | Effort                       | Notes                                                                                                           |
| ------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Identity backup           | Medium                       | The wallet has a phrase; the identity does not. Losing the phone still loses your identity, chats and contacts. |
| Mint HTTP over Tor on iOS | 2-3 days native Swift        | Needs a raw-socket module. Blocking is the safe interim.                                                        |
| NIP-60 relay sync         | Large, needs conflict design | Multi-device. Depends on identity backup to be useful at all.                                                   |

## FAQ for developers

**Why cashu-ts rather than rolling our own?**
Blind signatures, DLEQ, and NUT-13 derivation are exactly the kind of
cryptography you do not hand-roll. cashu-ts is the reference TypeScript
implementation and owns proof selection (RGLI), fee arithmetic, blinding, and the
mint HTTP surface. `wallet-service.ts` owns everything above it.

**Why is the wallet store a separate MMKV file?**
Because it is the only store holding bearer instruments. It gets AES-256 and a
keychain-held key; everything else relies on the OS sandbox.

**Why `(mint, unit)` composite keys?**
A mint can issue sat, usd and eur from the same host. Those are different
currencies and summing them would be a correctness bug, not a display bug.

**Why does `creditProofs` not take a `derived` parameter?**
Because it is never a judgement call. A proof is restorable exactly when the
wallet that created it had the seed loaded, so `isBackupActive()` at that moment
is the truth.

**Why does `wallet.send()`'s `keep` array include untouched originals?**
That is cashu-ts behaviour: `keep = [change, ...unselected]`. The difference
between what we offered and what came back is exactly the set the mint consumed.
This is load-bearing and commented at the call site.

**Why not `withKeyset()` in restore?**
It carries the seed but not the unit, so it silently builds a `sat` wallet that
then fails to bind a `usd` keyset. `batchRestore` takes a keyset id directly.

**Why is backup enabled when the words are shown rather than after the check?**
Otherwise a user who bails mid-flow has a phrase in the keychain with backup
marked off, and coins minted afterwards fall outside a phrase that exists. The
Unconfirmed state covers that window honestly instead.

**Why does `assertMintNetworkAllowed` read the mesh store instead of
`isTorRoutingActive()`?**
`tor-routing` imports the BLE native module at module scope, and
`wallet-service` is reachable from the panic wipe, which must stay loadable
without a native host. The store mirrors the same flag.
