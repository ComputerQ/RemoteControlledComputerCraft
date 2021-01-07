module.exports = class {
	constructor(connection) {
		this.commandid = 0;
		this.replies = {};
		this.requests = {};
		this.online = true;
		this.matrix = [
			[1, 0, -1, 0],
			[0, 1, 0, -1],
		];
		this.turns = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.id = -1;
		this.label = "";
		this.autoresume = true;
		this.autostartIdle = true;
		this.idle = true;

		this.reconnect(connection);
	}
	reconnect(connection) {
		this.connection = connection;
		this.online = true;

		this.connection.on("message", (message) => {
			const json = JSON.parse(message.utf8Data);
			if (json[1].length == 1) {
				this.replies[json[0]] = json[1][0];
			} else {
				this.replies[json[0]] = json[1];
			}
		});

		this.connection.on("close", () => {
			this.online = false;
		});

		for (let id in this.requests) {
			const obj = [id, this.requests[id]];
			this.connection.sendUTF(JSON.stringify(obj));
		}
	}
	execute(cmd) {
		if (this.online) {
			const id = this.commandid;
			const obj = [id, cmd];
			this.requests[id] = cmd;
			this.connection.sendUTF(JSON.stringify(obj));
			this.commandid++;
			return new Promise((resolve) => {
				let poll = setInterval(() => {
					if (this.replies[id] != null) {
						clearInterval(poll);
						const repl = this.replies[id];
						delete this.replies[id];
						delete this.requests[id];
						resolve(repl);
					}
				}, 1);
			});
		}
	}
	getComputerById(id) {
		for (let computer in cc) {
			if (id == computer.id) {
				return computer;
			}
		}
		return false;
	}
	getComputersByLabel(label) {
		let computers = [];
		for (let computer in cc) {
			if (id == computer.id) {
				computers.push(computer);
			}
		}
		return computers;
	}
	isMe(computer) {
		return computer.id == this.id;
	}
	//basic api
	print = async (...param) => {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`print(${par})`);
	};
	sleep = async (...param) => {
		const str = JSON.stringify(param);
		const par = str.substring(1, str.length - 1);
		return await this.execute(`sleep(${par})`);
	};
	//turtle api
	turtle = {
		getFuelLevel: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.getFuelLevel(${par})`);
		},
		getFuelLimit: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.getFuelLimit(${par})`);
		},
		refuel: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.refuel(${par})`);
		},
		craft: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.craft(${par})`);
		},
		select: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.select(${par})`);
		},
		getSelectedSlot: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.getSelectedSlot(${par})`);
		},
		getItemSpace: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.getItemSpace(${par})`);
		},
		getItemDetail: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.getItemDetail(${par})`);
		},
		equipLeft: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.equipLeft(${par})`);
		},
		equipRight: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.equipRight(${par})`);
		},

		turnRight: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			this.turns = this.turns + 1 > 3 ? 0 : this.turns + 1;
			return await this.execute(`turtle.turnRight(${par})`);
		},

		turnLeft: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			this.turns = this.turns - 1 < 0 ? 3 : this.turns - 1;
			return await this.execute(`turtle.turnLeft(${par})`);
		},
		forward: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			const ret = await this.execute(`turtle.forward(${par})`);
			if (ret === true) {
				this.x += this.matrix[0][this.turns];
				this.z += this.matrix[1][this.turns];
			}
			return ret;
		},
		back: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			const ret = await this.execute(`turtle.back(${par})`);
			if (ret === true) {
				this.x += -this.matrix[0][this.turns];
				this.z += -this.matrix[1][this.turns];
			}
			return ret;
		},
		up: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			const ret = await this.execute(`turtle.up(${par})`);
			if (ret === true) {
				this.y++;
			}
			return ret;
		},
		down: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			const ret = await this.execute(`turtle.down(${par})`);
			if (ret === true) {
				this.y--;
			}
			return ret;
		},
		inspect: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.inspect(${par})`);
		},
		inspectUp: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.inspectUp(${par})`);
		},
		inspectDown: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.inspectDown(${par})`);
		},
		dig: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.dig(${par})`);
		},
		digUp: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.digUp(${par})`);
		},
		digDown: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.digDown(${par})`);
		},
		attack: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.attackdig(${par})`);
		},
		attackUp: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.attackUp(${par})`);
		},
		attackDown: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.attackDown(${par})`);
		},
		compare: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.compare(${par})`);
		},
		compareUp: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.compareUp(${par})`);
		},
		compareDown: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.compareDown(${par})`);
		},
		place: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.place(${par})`);
		},
		placeUp: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.placeUp(${par})`);
		},
		placeDown: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.placeDown(${par})`);
		},
		drop: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.drop(${par})`);
		},
		dropUp: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.dropUp(${par})`);
		},
		dropDown: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.dropDown(${par})`);
		},
		suck: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.suck(${par})`);
		},
		suckUp: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.suckUp(${par})`);
		},
		suckDown: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.suckDown(${par})`);
		},
		transferTo: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			return await this.execute(`turtle.transferTo(${par})`);
		},
	};
	//os api
	os = {
		getComputerID: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			const ret = await this.execute(`os.getComputerID(${par})`);
			this.id = ret;
			return ret;
		},
		getComputerLabel: async (...param) => {
			const str = JSON.stringify(param);
			const par = str.substring(1, str.length - 1);
			const ret = await this.execute(`os.getComputerLabel(${par})`);
			this.label = ret;
			return ret;
		},
	};
	//ease of use custom functions
	q = {
		pointTo: async (x, z) => {
			let index = x == -1 ? 0 : x == 1 ? 1 : z == -1 ? 2 : 3;
			let matrix = [
				[2, 0, -1, 1],
				[1, -1, 2, 0],
				[0, 2, 1, -1],
				[-1, 1, 0, 2],
			];
			await this.q.turn(matrix[this.turns][index]);
		},

		doMoves: async (moves) => {
			if (moves.length == 0) {
				return;
			}
			let least = {
				index: 0,
				dist: Infinity,
				pos: [0, 0, 0],
				mov: [0, 0, 0],
			};

			for (let i = 0; i < moves.length; i++) {
				let dX = moves[i].x - this.x;
				let dY = moves[i].y - this.y;
				let dZ = moves[i].z - this.z;

				let dist = Math.abs(dX) + Math.abs(dY) + Math.abs(dZ);
				if (dist < least.dist) {
					least = {
						index: i,
						dist: dist,
						mov: [dX, dY, dZ],
						pos: [moves[i].x, moves[i].y, moves[i].z],
						tur: [this.x, this.y, this.z],
					};
				}
			}
			await this.q.relativePos(...least.mov);
			await moves[least.index].action.call(this);
			moves.splice(least.index, 1);
			await this.q.doMoves(moves);
		},

		relativePos: async (x, y, z) => {
			await this.q.moveV(y, false);
			switch (this.turns) {
				case 0:
					await this.q.moveH(x);
					if (z > 0) {
						await this.q.turn(1);
						await this.q.moveH(Math.abs(z));
					} else if (z < 0) {
						await this.q.turn(-1);
						await this.q.moveH(Math.abs(z));
					}
					break;
				case 1:
					await this.q.moveH(z);
					if (x > 0) {
						await this.q.turn(-1);
						await this.q.moveH(Math.abs(x));
					} else if (x < 0) {
						await this.q.turn(1);
						await this.q.moveH(Math.abs(x));
					}
					break;
				case 2:
					await this.q.moveH(-x);
					if (z > 0) {
						await this.q.turn(-1);
						await this.q.moveH(Math.abs(z));
					} else if (z < 0) {
						await this.q.turn(1);
						await this.q.moveH(Math.abs(z));
					}
					break;
				case 3:
					await this.q.moveH(-z);
					if (x > 0) {
						await this.q.turn(1);
						await this.q.moveH(Math.abs(x));
					} else if (x < 0) {
						await this.q.turn(-1);
						await this.q.moveH(Math.abs(x));
					}
					break;
			}

			return;
		},

		turn: async (amt) => {
			amt = amt % 4;
			for (let i = 0; i < Math.abs(amt); i++) {
				if (amt < 0) {
					await this.turtle.turnLeft();
				} else {
					await this.turtle.turnRight();
				}
			}
			return;
		},
		moveV: async (amt, noStop) => {
			await this.q.refuelIfLess(10);
			if (amt == 0) {
				return;
			}
			let success = amt > 0 ? await this.up() : await this.down();
			if (success === true) {
				amt = amt < 0 ? amt + 1 : amt - 1;
			} else if (!noStop) {
				await this.print("Stuck!");
				await this.sleep(3);
			}
			await this.q.moveV(amt);
			return;
		},
		moveH: async (amt) => {
			await this.q.refuelIfLess(10);
			if (amt == 0) {
				return;
			}
			let success =
				amt > 0 ? await this.turtle.forward() : await this.turtle.back();
			if (success === true) {
				amt = amt < 0 ? amt + 1 : amt - 1;
			} else {
				await this.print("Stuck!");
				await this.sleep(3);
			}
			await this.q.moveH(amt);
			return;
		},

		digDown: async () => {
			await this.checkInventory(turtle);
			await this.turtle.select(1);
			await this.digDown();
			return;
		},

		placeblock: async (block) => {
			let data = await this.turtle.inspectDown();
			if (data[0]) {
				if (data[1].name != block) {
					await this.digDown();
					await this.q.placeblock(block);
				}
			} else {
				await this.q.searchInventory(block, true);
				await this.q.placeDown();
			}
			return;
		},
		refuelIfLess: async (amt) => {
			if ((await this.turtle.getFuelLevel()) < amt) {
				await this.q.searchInventory("minecraft:coal", true);
				await this.turtle.refuel(1);
			}
			return;
		},
		checkInventory: async () => {
			await this.turtle.select(16);
			let item = await this.turtle.getItemDetail();
			if (item.count != null) {
				await this.print("Full!");
				await this.q.searchInventory("enderstorage:ender_storage", false);
				await this.placeUp();

				let data = await this.turtle.inspectUp();
				if (data) {
					await this.turtle.select(15);
					await this.dropUp();
					await this.turtle.select(16);
					await this.dropUp();
					await this.turtle.select(1);
					await this.digUp();
				}

				await this.sleep(1);
				await this.checkInventory();
			}
			return;
		},
		searchInventory: async (block, keep) => {
			let found = false;
			for (let i = 1; i <= 16; i++) {
				await this.turtle.select(i);
				let item = await this.turtle.getItemDetail();
				if (item.name == block) {
					if (!keep || item.count > 1) {
						await this.print(`Found ${block}.`);
						found = true;
						break;
					}
				}
			}
			if (found == false) {
				await this.print(`${block} empty.`);
				await this.sleep(5);
				await this.q.searchInventory(block, keep);
			}
			return;
		},
	};
};
