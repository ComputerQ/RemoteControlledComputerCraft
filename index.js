const WebSocketServer = require("websocket").server;
const express = require("express");
const app = express();
const server = app.listen(8080);

const wss = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

const Turtle = require("./turtle.js");

let turtles = [];
wss.on("request", (request) => {
	const connection = request.accept();

	let turtle = new Turtle(connection);
	turtles.push(turtle);
});

setInterval(async function () {
	for (let i = 0; i < turtles.length; i++) {
		let turtle = turtles[i];
		if (turtle.online) {
			let b = await turtle.getComputerID();
			console.log("id", b);
			b = await turtle.inspect();
			console.log("block", b);
			await turtle.print("hello world");
		}
	}
}, 1000);
