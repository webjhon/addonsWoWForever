#!/usr/bin/env sh
set -eu
node --experimental-strip-types evals/run-evals.ts
if command -v luacheck >/dev/null 2>&1; then
  luacheck examples/AllianceLevelPulse/AllianceLevelPulse.lua
else
  echo 'SKIP: luacheck unavailable; no Lua lint claim'
fi
if command -v lua >/dev/null 2>&1; then
  lua evals/wow-mock-env.lua examples/AllianceLevelPulse/AllianceLevelPulse.lua
else
  echo 'SKIP: Lua runtime unavailable; game/mock execution not verified'
fi
