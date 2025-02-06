class AuthMiddleware {
	// 验证token
	async verifyToken(ctx, next) {
		await next();
	}
	// 防盗链
}

module.exports = new AuthMiddleware();
