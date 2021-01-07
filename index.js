const WebSocketServer = require("websocket").server;
const express = require("express");
const app = express();
const server = app.listen(8080);

const wss = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

const Computer = require("./computer.js");

global.cc = {};

wss.on("request", async (request) => {
	const connection = request.accept();
	const computer = new Computer(connection);
	const label = await computer.os.getComputerLabel();
	const id = await computer.os.getComputerID();

	cc[id] = computer;

	try {
		let script = require(`./scripts/${label}.js`);
		delete require.cache[require.resolve(`./scripts/${label}.js`)];
		script = require(`./scripts/${label}.js`);

		script.apply(computer);
	} catch (err) {
		console.log(err);
	}
});
