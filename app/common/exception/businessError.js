class BusinessError extends Error {
	constructor(ConstError = ['', '']) {
		super(ConstError[1]);
		this.code = ConstError[0];
	}
}

module.exports = BusinessError;
