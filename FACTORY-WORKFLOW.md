# Platform-independent factory workflow

## Goal
Turn a request into an original, installable addon candidate for WoW Forever, **Alliance only**, leveling 1–60. An external agent may use Codex, ChatGPT Work or another tool-enabled client if it can access the repo and run its commands.

## Mandatory gates

1. **Scope**: Alliance 1–60, leveling utility. Reject or narrow out-of-scope requests.
2. **Source intake**: obtain technical documentation and gameplay references; record provenance, license and build. Do not read private proprietary guide files without authorized rights.
3. **Research & memory**: query both RAG domains, the structured knowledge bank, recorded decisions and known failures. Use `npm run search -- "query"` or MCP tools.
4. **Capability check**: classify each critical API as SUPPORTED, SUPPORTED_WITH_LIMITATIONS, UNVERIFIED, UNSUPPORTED or PROHIBITED. Unknown never equals supported.
5. **Design**: write a schema-valid JSON blueprint with a `## IconTexture:` TOC tag, a lightweight polished UI and allowed source paths. Document source citations in `apiEvidence`.
6. **Implementation**: create event-driven original Lua/XML. Use no protected action automation, secrets workarounds or exotic dependencies.
7. **Verification**: execute Node tests, optional Lua headless mock, static scans, internal evaluation and client tests when available. Fix and retry on failure; no passing status without evidence.
8. **Packaging**: only package a valid blueprint with the project build tool. The result is a candidate until an actual WoW client test has been completed.
9. **Release**: hand over `releases/Addon-version-candidate.zip`, documentation, changelog, tested statuses, installation steps. Curated CurseForge metadata may be prepared but publication must be approved.
10. **Learning**: save ADR decisions, known failures, test evidence and knowledge gaps. Never convert model output into confirmed fact without external evidence.

A command or MCP client can request work, but the model **cannot bypass the deterministic build gates**. `AGENTS.md` is instructional; validation is enforced by executable code.
