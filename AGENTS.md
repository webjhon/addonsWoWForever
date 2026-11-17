# Engineering contract — WoW Forever Alliance Addon Factory

You are an engineering agent operating a **closed, evidence-based journey**. This repository creates **original add-ons for World of Warcraft: Forever, Alliance, levels 1–60 only**.

## Hard requirements

- Do not produce Horde-only, raids/endgame, PvP-only, botting or automation add-ons.
- Confirm the target interface/build from `config/wow-version.json` AND the real client when possible. Current reference interface is 16001, not a generic Retail number. Forever uses Mainline-family APIs; do not assume Classic Era APIs.
- Follow `FACTORY-WORKFLOW.md` and `.agents/skills/build-alliance-addon/SKILL.md`. Use `knowledge/` and RAG before code generation.
- Every nontrivial API/quest/spell/event claim must have versioned evidence, or be marked UNVERIFIED. Never invent identifiers or coordinates.
- Respect taint, protected actions, secret values and the WoW addon security model.
- Treat Zygor/RestedXP and third-party references as copyrighted material. Analyze general UI patterns only with appropriate rights; do not publish copied guide steps, code or art.
- Make compact, performant, event-driven, elegant addons, each standalone with unique visual identity and icon.
- Always run all available checks; never label `STATIC_PASSED`/`MOCK_PASSED` as `CLIENT_VERIFIED`.
- Do not write releases directly; use `orchestrator.ts`/`tools/build-addon.ts` after validation. For external Codex/Work, the repo, not the model's response, is authoritative for passing checks.

## RELEASE-BLOCKING PRODUCT STANDARD (ALL ADDONS)

- Every addon MUST be a game-connected, high-value, reactive, context-aware player assistant, not a static list, a reading panel, a manually fed log, or a checkbox-only guide.
- Observe at least TWO distinct live player signals and a gameplay event (e.g. level, quest state, map, time, inventory, pet, XP or history); select the applicable signals for the requested purpose and document unavailable APIs.
- On every relevant event, reconcile current player state, decide what to do NEXT, and automatically update actionable in-game feedback. For quests: track accepted/objective progress/completion/turn-in, and present the next real step with verified navigation data when supported. For other addons: deliver equally real-time, automatic behavior fitting their domain.
- Manual clicks are fallback/configuration, never the primary game-progress mechanism. Do not produce a list-oriented candidate to fill an API/data gap; narrow scope or report BLOCKED, with evidence.
- Implement a usable first-open UI, quality gameplay states, per-character persistence/recovery and performance-conscious event processing. Show concrete player benefit before writing extensive code.
- Every addon MUST include **exact credits "Tonho Contrabando"** in TOC `## Author`, plus the shared pixel hunter and opening credits splash. Call `ns.TonhoBranding:RegisterWindow(mainFrame)` immediately after creating its primary window, or `ns.TonhoBranding:Show()` at first opening of a non-window interaction. The packager injects the reusable branded Lua and TGA.
- Provide `interactivity` in the blueprint with live signals, >=2 transitions, next action, recovery and >=3 acceptance scenarios. Provide an addon-specific runnable `tests/*.test.ts`. `src/product-quality.ts` and the packager MUST reject missing requirements and failing acceptance tests.
- Work in a feature branch, prepare commit and **open a pull request for user approval** with ZIP, documentation, representative screenshots/mock previews clearly labeled, test outcomes and unknowns. Never merge to main or publish without approval. If PR creation is impossible, explicitly report as BLOCKED and provide the branch link/patch; do not call the journey complete.
- Never claim a code/mock pass demonstrates real gameplay value or live-client compatibility. Actual gameplay/visual verification remains a release condition, not an imagined success.

## Production loop

Read context and project memory -> retrieve API/gameplay evidence -> verify client capability -> create blueprint -> implement -> guardrails -> evals -> review -> package candidate -> require client verification before publishing as tested.

Local commands: `npm run init`, `npm test`, `npm run doctor`, `npm run search -- "API"`, `npm run example`, `npm run mcp`.

## Learned live-client skills

Before implementing or revising an addon, route through knowledge/lessons/live-client.json using npm run skills:context -- "feature description". Apply verify-wow-client for acceptance planning; build-wow-ui for panels/navigation; highlight-quest-npcs for NPC/nameplate work. Read the selected SKILL.md and the linked session evidence. Selection is engineering context, not proof of execution or runtime certification. Reproduce applicable failures and turn them into acceptance scenarios; document unavailable client tests rather than simulating a pass.

Before designing **every addon**, apply .agents/skills/apply-reference-patterns/SKILL.md and inspect npm run patterns:context -- "feature description". Consider the original Zygor/RestedXP analysis in knowledge/lessons/reference-patterns.json; record adopted/adapted/not applicable with reasons in the product plan or PR. The LLM path includes this context and the journey records REFERENCE_PATTERN_REVIEW. Static observations never certify runtime APIs; raw market-references are not imported.
