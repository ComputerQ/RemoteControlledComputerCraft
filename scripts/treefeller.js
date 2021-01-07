module.exports = async function () {
	await this.print("Starting treefeller!");
	while (true) {
		while ((await this.turtle.getFuelLevel()) < 100) {
			await this.turtle.select(1);
			await this.turtle.refuel(1);
			await this.print("Refueling!");
		}

		let [success, block] = await this.turtle.inspectDown();
		if (success) {
			if (block.name == "minecraft:stone") {
				if (block.state.variant == "smooth_andesite") {
					await this.print("Found treespot!");
					await this.turtle.select(2);
					for (let i = 0; i < 4; i++) {
						await this.turtle.turnRight();
						await this.turtle.place();
						[success, block] = await this.turtle.inspect();
						if (success) {
							if (block.name.includes("log")) {
								await this.print("Found tree!");
								await this.turtle.dig();
								await this.turtle.forward();
								let height = 0;
								while ((await this.turtle.inspectUp())[0]) {
									success = await this.turtle.digUp();
									if (success) {
										await this.turtle.up();
										height++;
									}
								}
								while (height > 0) {
									[success, block] = await this.turtle.inspectDown();
									if (success) {
										await this.turtle.digDown();
									} else {
										await this.turtle.down();
										height--;
									}
								}
								await this.turtle.back();
								await this.turtle.place();
							}
						}
					}
					await this.turtle.forward();
				} else if (block.state.variant == "smooth_granite") {
					await this.print("Found chestspot!");
					for (let i = 0; i < 4; i++) {
						[success, block] = await this.turtle.inspect();
						if (success) {
							for (let i = 3; i <= 16; i++) {
								await this.turtle.select(i);
								await this.turtle.drop();
							}
						}
						await this.turtle.turnRight();
					}
					await this.turtle.forward();
				}
			} else if (block.name == "minecraft:stonebrick") {
				await this.turtle.suck();
				await this.turtle.forward();
			} else if (block.state.axis == "z") {
				await this.print("Found turnspot!");
				await this.turtle.turnLeft();
				await this.turtle.forward();
			} else if (block.state.axis == "x") {
				await this.print("Found turnspot!");
				await this.turtle.turnRight();
				await this.turtle.forward();
			}
		}
	}
};
