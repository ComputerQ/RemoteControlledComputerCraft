const WebSocketServer = require("websocket").server;
const express = require("express");
const app = express();
const server = app.listen(8080);

const wss = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

const Turtle = require("./turtle.js");

wss.on("request", async (request) => {
	const connection = request.accept();

	let turtle = new Turtle(connection);

	try {
		const label = await turtle.getComputerLabel();

		let script = require(`./scripts/${label}.js`);
		delete require.cache[require.resolve(`./scripts/${label}.js`)];
		script = require(`./scripts/${label}.js`);

		turtle = await script(turtle);
	} catch (err) {
		//bleh
		console.log(err);
	}
});
