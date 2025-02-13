class SnowflakeIdGenerator {
	constructor(machineId = 1, epoch = 1609459200000) {
		// 配置参数
		this.machineId = BigInt(machineId); // 机器 ID（范围：0-1023）
		this.epoch = BigInt(epoch || Math.floor(Date.now())); // 起始时间戳（毫秒）
		this.sequence = BigInt(0); // 序列号（范围：0-4095）
		this.lastTimestamp = BigInt(-1); // 上次生成 ID 的时间戳
	}

	// 生成 ID 的方法
	nextId() {
		// 获取当前时间戳
		let timestamp = BigInt(Date.now());

		// 检查时间回拨
		if (timestamp < this.lastTimestamp) {
			throw new Error('Clock moved backwards. Refusing to generate ID.');
		}

		// 如果时间戳未变，则递增序列号
		if (this.lastTimestamp === timestamp) {
			this.sequence = (this.sequence + 1n) & 0xfffn; // 0xFFF 表示 12 位
			if (this.sequence === 0n) {
				// 序列号溢出，等待下一毫秒
				timestamp = this.tilNextMillis(this.lastTimestamp);
			}
		} else {
			this.sequence = 0n;
		}

		this.lastTimestamp = timestamp;

		// 构建 64 位 ID
		const id =
			((timestamp - this.epoch) << 22n) |
			(this.machineId << 12n) |
			this.sequence;

		return BigInt(id).toString();
	}

	// 等待下一毫秒
	tilNextMillis(lastTimestamp) {
		let timestamp = BigInt(Date.now());
		while (timestamp <= lastTimestamp) {
			timestamp = BigInt(Date.now());
		}
		return timestamp;
	}
}

module.exports = SnowflakeIdGenerator;
