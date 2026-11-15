# Forever client compatibility baseline
Public community snapshots for World of Warcraft: Forever show an interface value of 16001 on the 1.60.x client line, and Mainline-family API shape rather than Classic Era API assumptions. Verify this locally using /dump select(4, GetBuildInfo()).
Potentially relevant functions and events (e.g. UnitXP, UnitXPMax, UnitLevel, UnitFactionGroup, PLAYER_XP_UPDATE, PLAYER_LEVEL_UP) are candidates only until confirmed against the target client build.
Source research: https://github.com/Thunderz96/forever-addon-kit and https://github.com/Atraeau/WoW-Addons . This is a summarized original note, not a copied source export.
