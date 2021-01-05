module.exports = class {
	constructor(connection) {
		console.log("Connection");
		this.connection = connection;
		this.commandid = 0;
		this.replies = {};
		this.online = true;
		this.x = 0;
		this.y = 0;
		this.z = 0;

		this.connection.on("message", (message) => {
			const json = JSON.parse(message.utf8Data);
			if (json[1].length == 1) {
				this.replies[json[0]] = json[1][0];
			} else {
				this.replies[json[0]] = json[1];
			}
		});

		this.connection.on("close", () => {
			console.log("Disconnected");
			this.online = false;
		});
	}
	execute(cmd) {
		const id = this.commandid;
		const obj = [id, cmd];

		this.connection.sendUTF(JSON.stringify(obj));
		this.commandid++;
		return new Promise((resolve) => {
			let poll = setInterval(() => {
				if (this.replies[id] != null) {
					clearInterval(poll);
					const repl = this.replies[id];
					delete this.replies[id];
					resolve(repl);
				}
			}, 1);
		});
	}
	async print(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`print(${par})`);
	}
	async getFuelLevel(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.getFuelLevel(${par})`);
	}
	async refuel(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.refuel(${par})`);
	}
	async turnRight(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.turnRight(${par})`);
	}
	async turnLeft(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.turnLeft(${par})`);
	}
	async forward(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.forward(${par})`);
	}
	async back(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.back(${par})`);
	}
	async inspect(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.inspect(${par})`);
	}
	async inspectUp(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.inspectUp(${par})`);
	}
	async inspectDown(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.inspectDown(${par})`);
	}
	async dig(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.dig(${par})`);
	}
	async digUp(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.digUp(${par})`);
	}
	async digDown(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.digDown(${par})`);
	}
	async getComputerID(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`os.getComputerID(${par})`);
	}
};
