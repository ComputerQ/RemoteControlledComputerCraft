
term.clear()
term.setCursorPos(1,1)

print("Remote Controlled Computer Craft (R.C.C.C.)")
print("By Quinten Muyllaert\n")

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
    if url == wsUrl then
        local eval, err = loadstring("return " .. contents)
        if err then print("Could not evaluate. " .. err) end
        local ret = eval()
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
    ws.send(os.getComputerID())
    print("Connected to WebSocket!") 
    while true do
        parallel.waitForAny(readMsg,socketDisconnect)
    end
    ws.close()
end

if err then
    printError("No websocket!")
    sleep(5)
    os.reboot()
end