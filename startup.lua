term.clear()
term.setCursorPos(1,1)
print("Remote Controlled Computer Craft (R.C.C.C.)")
print("By Quinten Muyllaert\n")

if fs.exists("/disk/startup.lua") then
    print("Found disk drive, updating software.")
    fs.delete("/startup.lua")
    fs.copy("/disk/startup.lua","/startup.lua")
end

local wsUrl = "ws://localhost:8080"
local ws, err = http.websocket(wsUrl)

function readMsg()
    local ok, err = pcall(msgf)
    if not ok then
    printError(err)
    end
end

function socketDisconnect()
    local ok, err = pcall(disf)
    if not ok then
    printError(err)
    end
end

function msgf()
    local event, url, contents = os.pullEvent("websocket_message")

    stuff = textutils.unserialiseJSON(contents)

    if url == wsUrl then
        local eval, err = loadstring("return " .. stuff[2])
        if err then print("Could not evaluate. " .. err) end
        local ret = textutils.serialiseJSON({stuff[1],{eval()}})
        ws.send(ret)  
    end
end

function disf()
    local event, url = os.pullEvent("websocket_closed")
    if url == wsUrl then
        printError("Disconnected!")
        sleep(1)
        os.reboot()
    end
end

if ws then
    print("Connected to WebSocket!") 
    while true do
        parallel.waitForAny(readMsg,socketDisconnect)
    end
end

if err then
    printError("No websocket!")
    sleep(5)
    os.reboot()
end

