// 验证token
const verifyToken = async (ctx, next) => {
	await next();
};
// 防盗链

module.exports = {
	verifyToken,
};
