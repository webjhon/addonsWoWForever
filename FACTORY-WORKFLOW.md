# Platform-independent factory workflow

## Goal
Turn a request into an original, installable addon candidate for WoW Forever, **Alliance and Horde**, leveling 1–60. An external agent may use Codex, ChatGPT Work or another tool-enabled client if it can access the repo and run its commands.

## Mandatory gates

1. **Scope**: Alliance and Horde 1–60, leveling utility. Reject or narrow out-of-scope requests.
2. **Source intake**: obtain technical documentation and gameplay references; record provenance, license and build. Do not read private proprietary guide files without authorized rights.
3. **Research & memory**: query both RAG domains, the structured knowledge bank, recorded decisions and known failures. Use `npm run search -- "query"` or MCP tools.
4. **Capability check**: classify each critical API as SUPPORTED, SUPPORTED_WITH_LIMITATIONS, UNVERIFIED, UNSUPPORTED or PROHIBITED. Unknown never equals supported.
5. **Product value gate**: before coding define measurable player benefit, direct game observation, a genuine next-action decision, >=2 automatic state transitions, a recovery strategy and three acceptance scenarios. The user must not feed progress manually. If unavailable APIs prevent it, mark BLOCKED; never substitute a static reading panel.
5a. **Brand and UX**: exact TOC Author "Tonho Contrabando"; reusable first-open splash with pixel hunter registered via `ns.TonhoBranding:RegisterWindow(frame)` or Show on first opening. Original addon-specific icon, in-game guidance, UX mocked across multiple gameplay states.
6. **Design**: write a schema-valid JSON blueprint with a `## IconTexture:` TOC tag, a lightweight polished UI and allowed source paths. Document source citations in `apiEvidence`.
7. **Implementation**: create event-driven original Lua/XML. Use no protected action automation, secrets workarounds or exotic dependencies.
8. **Verification**: execute Node tests, optional Lua headless mock, static scans, internal evaluation and client tests when available. Fix and retry on failure; no passing status without evidence.
9. **Quality and packaging gate**: product contract is machine checked; addon-specific tests must run and pass before packaging; automatic hunter credits are injected and final ZIP contents verified. The old STATIC_PASSED status is only a technical candidate, not product approval.
10. **Packaging**: only package a valid blueprint with the project build tool. The result is a candidate until an actual WoW client test has been completed.
11. **PR for approval**: commit to a named feature branch and open a pull request, with screenshots/mock preview labeled, ZIP, code under `addons/<name>/`, test evidence and an explicit request for user review. Never merge automatically.
12. **Release**: hand over `releases/Addon-version-candidate.zip`, documentation, changelog, tested statuses, installation steps. Curated CurseForge metadata may be prepared but publication must be approved.
13. **Learning**: save ADR decisions, known failures, test evidence and knowledge gaps. Never convert model output into confirmed fact without external evidence.

A command or MCP client can request work, but the model **cannot bypass the deterministic build gates**. `AGENTS.md` is instructional; validation is enforced by executable code.

## Incorporating real-client learning

Before design, run npm run skills:context -- "feature description" and read selected skills under .agents/skills/. The orchestrator records LEARNED_CLIENT_SKILLS for supplied blueprints; the LLM path receives the selected instructions before generation. The registry validates local skill/evidence paths; it does not certify that an agent followed them. Historical facts are indexed by npm run init in knowledge/seed-docs/forever-live-client-lessons.md, and retain PARTIAL_CLIENT_TESTED scope.

For applicable features, acceptance must include detection versus drawing, secret/unavailable data, real hit-testing over other UI, reload/character recovery, disabling/reenabling and stale-intent cleanup. Use the detailed selected skill, not a blanket requirement to run unrelated scenarios. After a client correction, add the missing regression and rerun the same real scenario. Report separately automated, observed and untested behavior. Final ZIP/installed hashes must correspond to the tested code; subsequent changes require proportional revalidation.

Before designing **every addon**, apply .agents/skills/apply-reference-patterns/SKILL.md and inspect npm run patterns:context -- "feature description". Consider the original Zygor/RestedXP analysis in knowledge/lessons/reference-patterns.json; record adopted/adapted/not applicable with reasons in the product plan or PR. The LLM path includes this context and the journey records REFERENCE_PATTERN_REVIEW. Static observations never certify runtime APIs; raw market-references are not imported.

RAG maintenance: run npm run init and npm run rag:status before research. Init materializes the reviewed expanded corpus and imports only hash-matching portable vectors. Neural retrieval requires one explicit npm run rag:model download; searches never download weights or call a paid embedding API automatically. After source changes, rerun init and npm run rag:embed; check npm run rag:eval and preserve documentary/partial evidence status. See rag/README.md.

Local client intake: before design read .agents/skills/inspect-local-client/SKILL.md and run npm run client:context. The journey records LOCAL_CLIENT_EVIDENCE and rejects a known configured-build mismatch. Refresh after a client update. Disk documentation never certifies runtime APIs; see docs/CLIENT-INTAKE.md.

Dual-faction policy (2026-11-17): all new or revised addons use faction:"Both" and the factionSupport contract. Read docs/FACTION-SUPPORT.md and config/faction-policy.json. Detect player faction, isolate faction-specific facts/routes, handle unknown faction safely, and execute acceptance tests for Alliance AND Horde. Historical exact single-faction candidates are preserved by hash, never relabeled as Horde-compatible; any changed candidate must migrate. Legacy neutral/Alliance-accessible knowledge does not imply Horde eligibility. Missing Horde facts remain explicit gaps.
