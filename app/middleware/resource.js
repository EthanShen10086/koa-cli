const path = require('path');
const StringUtils = require('../utils/StringUtils');

// 根据路由动态获取do model的数据结构
const addModelParams = async (ctx, next) => {
	const resource = ctx.request.params.resource;
	const modelName = StringUtils.capitalize(resource);
	// eslint-disable-next-line global-require
	const Model = require(path.join(__dirname, `../model/${modelName}`));
	ctx.Model = Model;
	await next();
};

module.exports = {
	addModelParams,
};
