# AURANPC2.1.0 — architecture and acceptance

Public signals: current character faction/level, authoritative quest journal, bag slot identity and live loot slot relation. Next action: draw a local !/border on the relevant item; never collect/use/move it.

Acceptance: valid quest item in visible loot highlights; acquisition changes to a bag badge; moving/clearing/recycling removes stale relations; abandonment/turn-in clears; ready-to-turn-in bag badge persists while redundant loot stops; inactive quest starters and generic quest class alone are rejected; unknown/restricted values fail safely; both factions and reload are tested separately. Default UI only, no third-party compatibility certification.

Detection, decision, own renderer and frame lifecycle are separated in Items.lua. Existing NPC engine remains authoritative for NPCs. New module must be loaded by the TOC before Core.lua; harness follows TOC.

## Reference patterns

- state-authority: ADOPTED: live journal/item flags are authoritative; drawing is separate.
- conditional-steps: ADAPTED: only active eligible quests, unknown faction fails closed.
- parallel-objectives: ADAPTED: mark every related slot; do not force a single selected quest.
- event-lifecycle: ADOPTED: coalesced events, bounded visible frames, no gameplay automation.
- recover-next-action: ADAPTED: rebuild associations after reload and clear tombstoned quests.
- guide-choice: NOT_APPLICABLE: no guide selection; independent effect preferences only.
- navigation-priority: NOT_APPLICABLE: no destination or route.
- navigation-confidence: NOT_APPLICABLE: no geometry or navigation promise.
- recoverable-ui: ADOPTED: independent switches, per-character settings and safe recovery.
- bounded-views: ADOPTED: recycled rows revalidate slots, bounded own overlay allocation.
- versioned-data: ADOPTED: local70959 evidence, old NPC data separately attributed.
- economical-feedback: ADOPTED: existing marks reused and pulse not restarted on every refresh.

No paid guide code, routes, art or DSL incorporated. In-game acceptance remains pending; automated passes are not CLIENT_VERIFIED.

Final source audit: local70959 ScrollBoxListView.EnumerateFrames returns ipairs, yielding index/frame. The production loop and mock both use this contract; all150 tests were rerun after correction and the ZIP regenerated. A frame-only mock would have hidden the failure. Hashes of both ScrollBox sources are recorded in ITEMS-API-EVIDENCE.json.
