# Azoth currency dataset

Sourced notes on the **Azoth** wallet currency in New World: Aeternum, for the fan site in `Marcelo-Barella/newworld-helper`. This folder is a research export only; the GitHub repo was not touched.

## Files

- `azoth.json` — machine-readable dataset (schema described in the build request). Generated 2026-11-15, America/Sao_Paulo (`-03:00`).

## Scope

Values are for **official Amazon servers**. Project Azoth has published no Azoth costs as of 2026-11-15 (`https://projectazoth.com/api/stats`).

Azoth (fast travel, some crafting, weapon-mastery respecs) is not Azoth Salt (the May 2022 PvP-track currency).

## How to read confidence and risk

- `confirmed` — official patch notes or an official newworld.com article states the number or mechanic.
- `likely` — consistent recent guides or live database tooltips, or an official mechanic without a later official number.
- `unknown` — the activity exists or was researched, but no trustworthy amount was found (`null`).
- `outdated_risk: true` — the cited source may predate Aeternum (Oct 14–15, 2024) or the Apr 21, 2026 maintenance, or a later unofficial retune is possible.
- `source_date: null` means the page itself is undated; the record notes that it was accessed on 2026-11-15.

No amounts were invented. Prefer `null` over a guessed number.

## Watch-outs

- Official February 2022 notes still say shrine/town travel costs a flat **20** Azoth (no distance or weight surcharge) and inn recall is **30 minutes**. Independent May–October 2024 guides instead say **10** in-territory / **20** out-of-territory, and a **15-minute** inn cooldown. Both views are recorded.
- The Apr 21, 2026 notes (2x XP, five houses, gold cap, gypsum/umbral limits, Elysian MSQ-gate) do **not** mention Azoth costs or the 2,500 wallet cap.
- Azoth Springs yield **Azoth Water** (a material), not wallet Azoth.
