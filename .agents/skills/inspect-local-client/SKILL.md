---
name: inspect-local-client
description: Inspect an authorized local Forever installation and bind disk API/schema evidence to its build before addon design or after a client update.
---

Read knowledge/client/current.json and docs/CLIENT-INTAKE.md. Run npm run client:context before design. The journey also records LOCAL_CLIENT_EVIDENCE; the LLM receives this context automatically.

When the installed build changes or documentary evidence is insufficient, run npm run client:inspect -- "<client root>" "<workspace extracted directory>". Review .data/client-intake.json before replacing reviewed evidence. Re-extract the exact manifest for that build; never attribute arbitrary files to a client from their names alone.

Use .build.info's active wowf row and public build/CDN keys; never export tags, account directories, saved variables, credentials or personal logs. Only textLocale/audioLocale are read from Config.wtf. Preserve missing CVars as unknown. Client files are read only; extracted work stays in the workspace. No loader modification, injection, keys acquisition or protected-action workaround.

TACTTool 0.2.0-alpha1 successfully read this product-specific CASC; CascLib 3.0 could not open it (error 2). That failure did not indicate client corruption. Use exact list mode with numeric FileDataIDs or verified names; name mode can ignore the output directory. Check actual files and hashes, not merely exit code. Missing names may trigger an online listfile fallback: restrict network during local extraction and do not acquire encryption keys.

Parse Lua literal metadata, never execute extracted source. ScriptObject names identify documentation types, not callable global namespaces; use frame methods only on suitable objects. Preserve argument/return nilability and secret metadata; missing metadata is unknown, not unrestricted access. A method's presence does not prove access in combat or availability of nonsecret values.

WDB records are server responses cached after encounters, not a complete quest bank and never accepted/completed quest state. Do not redistribute cache text or complete encountered ID lists. WDC5 schemaTag and client build can differ: the observed 70938 client stores WOWSTATIC_1_60_1_70399. Decode rows only with matching layout/schema evidence; min/max IDs do not prove a specific ID exists. Header counts do not prove usable navigation or indoor coordinates.

Disk/hash verification remains LOCAL_DISK_OBSERVATION or LOCAL_CLIENT_DOCUMENTATION. Runtime stays UNVERIFIED until a scoped live test. Never promote the entire capability registry after a successful extraction. Apply verify-wow-client when planning actual gameplay acceptance.
