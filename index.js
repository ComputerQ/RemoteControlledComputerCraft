const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
	console.log("Connection!");

	let moves = ["id"];
	let replies = [];

	ws.on("message", function (message) {
		replies.push(message);
	});

	async function execute(cmd) {
		moves.push(cmd);
		const len = moves.length;
		ws.send(cmd);
		return new Promise((resolve) => {
			let poll = setInterval(() => {
				if (replies.length >= len) {
					clearInterval(poll);
					resolve(replies[len - 1]);
				}
			}, 1);
		});
	}

	start();
	async function start() {
		let fuel = await execute("turtle.getFuelLevel()");
		console.log("fuel", fuel);

		if (fuel < 100) {
			await execute("turtle.refuel()");
		}

		for (let i = 0; i < 10; i++) {
			await execute("turtle.dig()");
			await execute("turtle.forward()");
			await execute("turtle.digDown()");
			await execute("turtle.digUp()");
		}

		console.log(await execute("select(2,turtle.inspectDown()).name"));
	}
});
