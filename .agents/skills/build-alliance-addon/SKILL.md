---
name: build-alliance-addon
description: Follow the rigorous WoW Forever Alliance leveling addon engineering journey and package a candidate artifact.
---
# Build Alliance Addon

Use this Skill when a user asks for a new or revised WoW Forever addon. Read `AGENTS.md`, `FACTORY-WORKFLOW.md`, `config/wow-version.json` and `docs/READY-FOR-AGENT.md` first.

1. First read `docs/PROFESSIONAL-INTERACTIVITY.md` and `docs/TONHO-BRANDING.md`. All addons MUST be player-connected reactive products: never lists, reading screens, manually maintained progress or checkbox-only guides. Explicitly define what the addon observes and automatically changes in gameplay. Do not write code if benefit/data are insufficient.
2. Confirm it benefits Alliance leveling 1–60; reject Horde/endgame/pvp/bots.
3. Run `npm run doctor` and `npm run search -- "feature keywords"`. Ask the MCP tools for API evidence, capabilities, relevant Alliance records and known failures. Consult market references **only for lawful feature analysis**.
3a. Before designing the acceptance scenarios, run npm run skills:context -- "feature description" and read the selected local skills from knowledge/lessons/live-client.json. Apply verify-wow-client for planning/actual client verification, build-wow-ui for panels/navigation and highlight-quest-npcs for NPC/nameplate features. Reuse the failures and successes only within the scope stated by their session reports. The selection is recorded in the journey and injected into the configured LLM path; it is not proof of following the instructions. Preserve clientVerified:false for incomplete real validation.

4. Separate verified data from hypotheses; do not invent unverified quest IDs, APIs or coordinates. If evidence insufficient, mark UNVERIFIED and document the risk.
5. Write a JSON blueprint conforming to `schemas/addon-blueprint.schema.json`; use original code, original icon/art and minimal dependencies.
6. Write and run addon-specific behavior tests for at least THREE progression scenarios with state changes. Then execute `npm test` and `npm run example` before new work, then `node --experimental-strip-types orchestrator.ts --blueprint path/to/new.blueprint.json` for the new addon.
7. Check `traces/last-journey.json`, `releases/*.zip`, metadata and API evidence. Run actual WoW client checks manually when possible. Never present a static result as CLIENT_VERIFIED.
8. Include release notes, installation instructions, version, test results and pending client-verification steps.

For Codex, use the skill file; for ChatGPT Work or a different tool-enabled agent, use `FACTORY-WORKFLOW.md` and connect the same MCP tools when supported. Never imply that merely reading the skill performs tests.

9. Ensure `## Author: Tonho Contrabando` and call `ns.TonhoBranding:RegisterWindow(frame)` at the first opening (or Show for non-window addons); packager injects reusable art and branding Lua. Confirm credits/splash in built ZIP.
10. Place code in `addons/<addon>/`, candidate ZIP in `releases/`; make an isolated feature branch, open a pull request for the user with test evidence and screenshots. Do not merge without explicit approval. If PR cannot be opened, say so and provide branch/patch; never quietly stop at a local ZIP.

Before designing **every addon**, apply .agents/skills/apply-reference-patterns/SKILL.md and inspect npm run patterns:context -- "feature description". Consider the original Zygor/RestedXP analysis in knowledge/lessons/reference-patterns.json; record adopted/adapted/not applicable with reasons in the product plan or PR. The LLM path includes this context and the journey records REFERENCE_PATTERN_REVIEW. Static observations never certify runtime APIs; raw market-references are not imported.
