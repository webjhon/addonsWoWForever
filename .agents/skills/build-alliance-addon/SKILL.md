---
name: build-alliance-addon
description: Follow the rigorous WoW Forever Alliance leveling addon engineering journey and package a candidate artifact.
---
# Build Alliance Addon

Use this Skill when a user asks for a new or revised WoW Forever addon. Read `AGENTS.md`, `FACTORY-WORKFLOW.md`, `config/wow-version.json` and `docs/READY-FOR-AGENT.md` first.

1. Confirm it benefits Alliance leveling 1–60; reject Horde/endgame/pvp/bots.
2. Run `npm run doctor` and `npm run search -- "feature keywords"`. Ask the MCP tools for API evidence, capabilities, relevant Alliance records and known failures. Consult market references **only for lawful feature analysis**.
3. Separate verified data from hypotheses; do not invent unverified quest IDs, APIs or coordinates. If evidence insufficient, mark UNVERIFIED and document the risk.
4. Write a JSON blueprint conforming to `schemas/addon-blueprint.schema.json`; use original code, original icon/art and minimal dependencies.
5. Execute `npm test` and `npm run example` before new work, then `node --experimental-strip-types orchestrator.ts --blueprint path/to/new.blueprint.json` for the new addon.
6. Check `traces/last-journey.json`, `releases/*.zip`, metadata and API evidence. Run actual WoW client checks manually when possible. Never present a static result as CLIENT_VERIFIED.
7. Include release notes, installation instructions, version, test results and pending client-verification steps.

For Codex, use the skill file; for ChatGPT Work or a different tool-enabled agent, use `FACTORY-WORKFLOW.md` and connect the same MCP tools when supported. Never imply that merely reading the skill performs tests.
