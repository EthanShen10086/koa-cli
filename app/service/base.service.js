// 这里的封装是用于sequelize的
const { Model } = require('sequelize');

class BaseService {
	constructor(model) {
		if (!(model.prototype instanceof Model)) {
			throw new Error('Invalid model provided');
		}
		this.model = model;
	}

	async findAll(options = {}) {
		return this.model.findAll(options);
	}

	async findOne(options = {}) {
		return this.model.findOne(options);
	}

	async create(data) {
		return this.model.create(data);
	}

	async update(data, options = {}) {
		return this.model.update(data, options);
	}

	async delete(options = {}) {
		return this.model.destroy(options);
	}
}

module.exports = BaseService;
