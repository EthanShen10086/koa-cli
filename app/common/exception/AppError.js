class AppError extends Error {
	constructor(code, message, status = 500) {
		super(message);
		this.code = code;
		this.status = status;
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

// 业务错误
class BusinessError extends AppError {
	constructor(errorInfo) {
		super(errorInfo[0], errorInfo[1], 400);
	}
}

// 认证错误
class AuthError extends AppError {
	constructor(message = '认证失败') {
		super('401', message, 401);
	}
}

module.exports = {
	AppError,
	BusinessError,
	AuthError,
};
