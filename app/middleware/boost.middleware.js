const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const config = require(path.join(__dirname, '../../config/config.default'));
// 静态资源缓存
const staticOptions = {
	maxage: config.staticOptions.cacheTime,
	setHeader: (res, filePath) => {
		// 强缓存
		res.setHeader(
			'Cache-Control',
			`public, max-age=${config.staticOptions.cacheTime}`,
		);
		// 协商缓存
		// 使用Last Modified
		const stats = fs.statSync(filePath);
		res.setHeader('Last-Modified', stats.mtime.toUTCString());
		// 使用Etag
		const fileContent = fs.readFileSync(filePath);
		const etag = crypto.createHash('md5').update(fileContent).digest('hex');
		res.setHeader('Etag', etag);
	},
};
// 动态资源缓存（api 缓存）
const apiBoost = async (ctx, next) => {
	// 优先执行api逻辑
	await next();
	if (ctx.status !== 200) {
		return;
	}
	// 生成Etag
	const body = JSON.stringify(ctx.body);
	const etag = crypto.createHash('md5').update(body).digest('hex');
	// 每次请求接口时，强制要求缓存把请求提交给原始服务器进行验证
	ctx.set('ETag', etag);
	ctx.set('Cache-Control', 'no-cache');
	// 检查请求头 如果Etag匹配，则返回304
	if (ctx.get('If-None-Match') === etag) {
		ctx.status = 304;
		ctx.body = '';
	}
};
module.exports = {
	apiBoost,
	staticOptions,
};
