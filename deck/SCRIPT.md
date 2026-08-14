# Script

Two minutes fifty at a normal speaking pace. Ten slides, roughly seventeen
seconds each, and the two that carry the argument get longer.

Say these lines, not more. The slide is already on screen and the room can read.
Pause where a full stop is, breathe before slide 8, and stop talking after the
last line.

**01 · Cover** `0:00`

> Airhop is a messenger that works with no internet at all. Nearby phones pass
> your messages along over Bluetooth. It is shipped, it is on both stores, and
> it is free.

**02 · The problem** `0:12`

> Every messenger on your phone has one thing in common. Take the network away
> and it goes quiet. That happened three hundred and thirteen times last year,
> across fifty-two countries. Governments switch it off, wars take it out,
> storms knock it down.

**03 · Demand** `0:30`

> Nobody advertises these apps. When Nepal blocked twenty-six platforms, bitchat
> went from three and a half thousand installs to almost forty-nine thousand in
> a single day. Last July, India ordered three of them off the stores. Nobody
> bans software that does not work.

**04 · Landscape** `0:50`

> Everything that works offline needs hardware people do not own. Everything
> that runs on a normal phone stops when the network does. Two apps sit in the
> corner that does both, and one of them is ours.

**05 · The product** `1:04`

> Here it is, shipped. Four tabs. No sign-up, no phone number, nothing to pair.
> You install it and it is already looking for people.

**06 · How it works** `1:14`

> Your phone finds others over Bluetooth and hands the message on, up to seven
> hops, about three hundred and fifty metres through a crowd. The phones in
> between carry it blind. Where there is internet, public relays take it
> further.

**07 · Security** `1:31`

> We assume the stranger standing next to you is hostile. Noise XX for the
> session, Double Ratchet per message, every packet signed. Seventy attacks run
> against a simulated mesh. No outside audit yet, and I am not going to pretend
> otherwise.

**08 · The wedge** `1:50`

> This is the part that matters. Airhop speaks bitchat's protocol exactly, so
> the first install lands in a mesh that already exists. Then we add the four
> things it does not have. An interface built on real usability research,
> because a privacy tool nobody can use protects nobody. Money that moves
> offline. An assistant that runs on the device. And the same features on both
> platforms, on the same day.

**09 · Market and model** `2:18`

> Mesh networking is an eleven billion dollar market and nearly all of it is
> hardware. We are the software half. There are no servers, so one user and a
> million cost the same to serve. And nobody is paying fifty dollars a year for
> this, so the value sits in the protocol.

**10 · The ask** `2:38`

> Two things. Fund the audit, because I cannot certify my own cryptography. And
> open the door to the groups already working where the network goes down.
> Everything else is scoped and moving.

> When the network goes down, the mesh is still up.

`2:50`

## If you get sixty seconds

> Every messenger stops when the network stops, and last year the network was
> switched off three hundred and thirteen times. Airhop keeps working. Nearby
> phones relay for each other over Bluetooth, encrypted, no servers and no
> accounts. It is shipped on both stores, and it speaks the same protocol as the
> one app already doing this, so it starts inside a network instead of building
> one. What it needs is an external audit, and people who already work where the
> network goes dark.

## If they ask

**"How is this different from bitchat?"** We are compatible with it, not
competing with it. On top of their protocol we add the interface, offline
payments, an on-device assistant, and the same feature set on iOS and Android.
Their two native codebases drift apart; ours is one.

**"What is the business model?"** An SDK at v1.8, supported deployments for
response organizations, and grant funding for the audit. There is no
infrastructure bill, so the burn is engineer time.

**"How far does Bluetooth actually reach?"** Thirty to fifty metres a hop, seven
hops, so about three hundred and fifty metres through a crowd. Beyond that it
uses public relays if anyone has a connection.

**"Is it secure?"** The design is. Noise XX, Double Ratchet, signed packets, no
plaintext on disk. It has not been audited by anyone outside the project yet,
which is the first line of the ask.

**"What happens if a government bans it?"** Three of these apps were delisted in
India last July. Delisting does not uninstall anything and it does not touch a
running mesh. The source is MIT and there is no company to serve a notice on.

**"Who is building it?"** One maintainer, in the open, no company and no funding.
That is the honest state of it, and the reason the ask is written the way it is.

## The appendix

Three slides sit behind the ten: architecture, roadmap, risks. Do not present
them. Open one when a question earns it, then go back.
