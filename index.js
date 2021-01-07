const WebSocketServer = require("websocket").server;
const express = require("express");
const app = express();
const server = app.listen(8080);

const wss = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

const Computer = require("./computer.js");

global.code_instances_running = 0;
global.cc = {};

wss.on("request", async (request) => {
	const connection = request.accept();
	let computer = new Computer(connection);
	const label = await computer.os.getComputerLabel();
	const id = await computer.os.getComputerID();

	if (cc[id] != null) {
		if (cc[id].autoresume) {
			console.log(`Computer ${id} back online, resuming script.`);
			cc[id].reconnect(connection);
			return;
		}
	}

	cc[id] = computer;

	try {
		let script = require(`./scripts/${label}.js`);
		delete require.cache[require.resolve(`./scripts/${label}.js`)];
		script = require(`./scripts/${label}.js`);

		console.log("Running new instance of script.");
		code_instances_running++;
		computer.idle = false;
		await script.apply(computer);
		computer.idle = true;
		code_instances_running--;
	} catch (err) {
		console.log(err);
	}
});
