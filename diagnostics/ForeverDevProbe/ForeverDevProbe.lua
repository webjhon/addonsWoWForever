local addonName, ns = ...
ForeverDevProbeDB = ForeverDevProbeDB or { events = {} }
local db = ForeverDevProbeDB
local version, build, buildDate, interface = GetBuildInfo()
db.version, db.build, db.interface, db.addon = tostring(version or "unknown"), tostring(build or "unknown"), tonumber(interface or 0), addonName
local counts = {}
for _, item in ipairs(db.events or {}) do
    if type(item) == "table" and type(item.event) == "string" then counts[item.event] = tonumber(item.count) or 0 end
end
local frame = CreateFrame("Frame")
for _, event in ipairs({"PLAYER_ENTERING_WORLD", "PLAYER_XP_UPDATE", "PLAYER_LEVEL_UP"}) do frame:RegisterEvent(event) end
frame:SetScript("OnEvent", function(_, event)
    counts[event] = math.min(10000, (counts[event] or 0) + 1)
    local list = {}
    for key, value in pairs(counts) do list[#list + 1] = { event = key, count = value } end
    db.events = list
end)
SLASH_FOREVERDEVPROBE1 = "/fdp"
SlashCmdList["FOREVERDEVPROBE"] = function()
    print("ForeverDevProbe: build " .. db.build .. ", interface " .. db.interface .. ". Logout or /reload to save diagnostics.")
end
