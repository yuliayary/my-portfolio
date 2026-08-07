---
title: "Designing\na parking app"
titleBreakMobileOnly: true
slug: "parking-app"
company: ""
industry: ""
tags: ["Mobile design"]
type: "App design"
order: 2
cover: "" # TODO: add cover image to /public/images/ and reference it here
---

This project was done during my studies at Projector Creative and Tech Online Institute as a study project.

This was a short study project — around two weeks for the full process, from brief to user flow, wireframes, polished screens, and final presentation.

## The problem

Parking in Ukrainian cities today means juggling apps. Kyiv has its own system, Lviv has another, and other cities run their own local or semi-official solutions — so a driver moving between cities has to install a new app, re-enter their car and payment details, and relearn a different interface every time. Two existing products, Kyiv Digital and Privat24 Parking, solve this for a single city or a single bank's customers, but neither works as a national solution.

This fragmentation creates two concrete failure points:

- **Finding and paying for parking** takes longer than it should, especially for drivers outside their home city — tourists, visitors, or service drivers like couriers and taxis who move between cities regularly.
- **Fines** are a second layer of friction. Metered parking depends on drivers remembering to stop the clock, and when they forget, paying the resulting fine is its own disconnected, often confusing process.

The underlying anxiety is less about the mechanics and more about uncertainty — *did I pay correctly, is the meter still running, will I get fined.* A parking app that removes that background stress, rather than just digitizing payment, was the real design target.

**Who it's for**

- Regular city residents who park daily
- Tourists and visitors unfamiliar with local parking systems
- Service drivers (couriers, taxis) who need to park quickly and repeatedly across a city, with future potential for business integrations

**Goal:** one national app that unifies parking search, payment, and fine handling across all Ukrainian cities — removing the need to juggle five different apps depending on where you're driving.

My job was to design a parking app with these main requirements:

- All Ukrainian cities, all parking-related functions in one place
- Simple and clear app. Looks official, but not corporate

*As a short study project, the problem above is grounded in the creative brief and competitive landscape rather than primary user research (interviews, surveys).*

## The concept

The brief asked for two things that pull in different directions: an app that feels *official* (a state service handling money and fines) but not *corporate* (cold, bureaucratic, unwelcoming) — and one that gives drivers a sense of calm rather than the low-grade stress of "did I forget to pay."

I combined two symbols to hold both ideas at once:

- **The loop** — a road that folds into a pause symbol — represents the actual user motion: *drive, pause, keep driving.* Parking is a brief interruption in a longer trip. The loop shape keeps that feeling of continuity rather than treating parking as a separate, disconnected task.
- **The "P"** — the internationally recognized parking symbol anchors the app immediately as *official*. Drivers already trust this symbol on street signs; reusing it signals legitimacy without needing heavy government-issued visual language (crests, formal typography, etc.) that would tip into "corporate."

Together, the two symbols let the brand feel state-backed and trustworthy, while the loop's soft, continuous shape keeps it from feeling stiff or institutional, directly answering the brief's "official but not corporate" requirement.

The loop-and-pause motif carries through logo, and key UI moments (e.g. the parking session start/stop states), so the concept is a visual language.

[2 pictures for the concept]

## Competitor & reference research

Since primary user research wasn't part of this project's scope, I built my understanding of the space through a broad competitor and reference review instead. This covered three layers: **direct competitors** in Ukraine (Kyiv Digital, Privat24 Parking) to see how the fragmentation problem currently plays out in practice; **parking apps from other countries** to see how other markets handle search, payment, and fines end-to-end; and **apps where the map is the central interface** more broadly, to understand interaction patterns for filtering, pins, and spot selection that users already have muscle memory for. This reference pool shaped decisions like leading with the map on the home screen and using familiar filter patterns, rather than inventing new interaction models from scratch.

[references]

## User flow

Before moving into individual screens, I mapped out the core user flow — from opening the app to finding a spot, reserving it, tracking an active session, and handling payment or a fine if one occurs. Laying this out early made sure every screen served a specific step in that path, rather than screens getting designed in isolation and stitched together afterward.

[user flow diagram]

## The result

**Getting started**

The welcome screen introduces the loop — "Find parking → Park → Keep going".

[welcome screen]

**Getting set up**

Registration collects only what's needed to actually use the app (name, email, car plate) rather than a heavier onboarding form, and payment setup supports credit card, Apple Pay, and Google Pay — covering the range of payment habits across a broad, non-tech-first national user base rather than assuming everyone defaults to one payment method.

[account screens]

**Finding and reserving a spot**

The home screen leads with the map, since that's the core mental model from the brief's "killer feature" — one map, one search, across any Ukrainian city, rather than a directory of separate city systems. Filters (price, free parking, 24/7 access, CCTV/security) let users narrow spots by what actually matters to them beyond just proximity. Tapping a spot surfaces price per hour, free spots remaining, and the car plate that will be used — confirming the right details *before* committing to "Reserve now," which matters for a payment-driven flow where mistakes cost money.

[map screens]

**The parking session**

This is where the case study's core emotional problem — *did I actually start/stop the meter?* — gets a direct answer. "Your parking has started" and "Your parking has finished" are explicit confirmation states, not just a silent timer running in the background. Each includes price per hour and time parked, so the cost is never a surprise. A secondary "Remind me" action on the active session addresses the brief's requirement for a nudge before the driver forgets and gets fined — this is a small screen, but it's a direct design response to the anxiety named in the problem section.

[state screens]

**When a fine happens anyway**

Rather than treating a parking ticket as a dead-end error state, it's designed with the same visual language as the rest of the flow (same card layout, same loop motif) — plus the same "Remind me" and a clear "Pay now" action. Keeping the fine screen inside the app's normal visual system, instead of some jarring reformatted receipt, was a deliberate choice to reduce the friction/embarrassment a driver feels when they've been fined, per the brief's "avoid negative thoughts about parking" ambition.

[fine screens]

## Reflection

As a UX researcher, starting this project without the chance to actually learn from customers was genuinely uncomfortable — normally that's where I'd begin. On top of that, I'm not a driver myself, so I couldn't fall back on personal intuition either. I compensated by leaning heavily on competitor research and collecting a wide set of references from parking apps and map-based interfaces, but that's a real limitation of this project, not a substitute for talking to actual drivers.

**What I'd do differently**

- Talk to real drivers — especially people currently juggling Kyiv Digital, Privat24, or city-specific tools — to validate whether "one app for everything" is actually the friction point.
- Address a mentor's feedback I haven't fully solved: some screens, like an active parking session versus a parking ticket, look quite similar at a glance. They share the same layout and loop motif, which was meant for visual consistency, but risks working against the user in a moment where the difference (still fine, vs. now a problem) really matters.
- Reduce my reliance on color to signal something's gone wrong (e.g. red vs. blue on the fine screen). It's not accessible for colorblind users, and color alone is a weak signal under stress anyway.
- Navigation to the parking spot wasn't part of my design. Looking at other map-based apps, turn-by-turn or at least a "navigate here" shortcut is fairly standard. With more time, I'd validate how critical this actually is for users and add it if so.

Thank you for checking this case study!

[check another case study]
