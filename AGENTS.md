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

## Production loop

Read context and project memory -> retrieve API/gameplay evidence -> verify client capability -> create blueprint -> implement -> guardrails -> evals -> review -> package candidate -> require client verification before publishing as tested.

Local commands: `npm run init`, `npm test`, `npm run doctor`, `npm run search -- "API"`, `npm run example`, `npm run mcp`.
