module.exports = class {
	constructor(connection) {
		console.log("Connection");
		this.connection = connection;
		this.commandid = 0;
		this.replies = {};
		this.online = true;
		this.matrix = [
			[1, 0, -1, 0],
			[0, 1, 0, -1],
		];
		this.turns = 0;
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
	async sleep(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`sleep(${par})`);
	}
	async getFuelLevel(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.getFuelLevel(${par})`);
	}
	async getFuelLimit(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.getFuelLimit(${par})`);
	}
	async refuel(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.refuel(${par})`);
	}
	async craft(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.craft(${par})`);
	}
	async select(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.select(${par})`);
	}
	async getSelectedSlot(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.getSelectedSlot(${par})`);
	}
	async getItemSpace(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.getItemSpace(${par})`);
	}
	async getItemDetail(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.getItemDetail(${par})`);
	}
	async equipLeft(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.equipLeft(${par})`);
	}
	async equipRight(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.equipRight(${par})`);
	}
	async turnRight(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		this.turns = this.turns + 1 > 3 ? 0 : this.turns + 1;
		return await this.execute(`turtle.turnRight(${par})`);
	}
	async turnLeft(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		this.turns = this.turns - 1 < 0 ? 3 : this.turns - 1;
		return await this.execute(`turtle.turnLeft(${par})`);
	}
	async forward(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		const ret = await this.execute(`turtle.forward(${par})`);
		if (ret === true) {
			this.x += this.matrix[0][this.turns];
			this.z += this.matrix[1][this.turns];
		}
		return ret;
	}
	async back(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		const ret = await this.execute(`turtle.back(${par})`);
		if (ret === true) {
			this.x += -this.matrix[0][this.turns];
			this.z += -this.matrix[1][this.turns];
		}
		return ret;
	}
	async up(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		const ret = await this.execute(`turtle.up(${par})`);
		if (ret === true) {
			this.y++;
		}
		return ret;
	}
	async down(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		const ret = await this.execute(`turtle.down(${par})`);
		if (ret === true) {
			this.y--;
		}
		return ret;
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
	async attack(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.attackdig(${par})`);
	}
	async attackUp(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.attackUp(${par})`);
	}
	async attackDown(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.attackDown(${par})`);
	}
	async compare(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.compare(${par})`);
	}
	async compareUp(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.compareUp(${par})`);
	}
	async compareDown(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.compareDown(${par})`);
	}
	async place(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.place(${par})`);
	}
	async placeUp(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.placeUp(${par})`);
	}
	async placeDown(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.placeDown(${par})`);
	}
	async drop(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.drop(${par})`);
	}
	async dropUp(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.dropUp(${par})`);
	}
	async dropDown(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.dropDown(${par})`);
	}
	async suck(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.suck(${par})`);
	}
	async suckUp(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.suckUp(${par})`);
	}
	async suckDown(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.suckDown(${par})`);
	}
	async transferTo(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`turtle.transferTo(${par})`);
	}
	async getComputerID(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`os.getComputerID(${par})`);
	}
	async getComputerLabel(...param) {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`os.getComputerLabel(${par})`);
	}
};
