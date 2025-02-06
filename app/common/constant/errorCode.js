const ErrorCodeMap = {
	ERROR_0x0000: ['0x0000', '未知错误'],
	ERROR_0x0002: ['0x0002', '请求参数非法'],
	ERROR_0x0004: ['0x0003', '请求操作对象已存在'],
	ERROR_0x0003: ['0x0004', '请求操作对象不存在'],
	ERROR_0x0005: ['0x0005', '请求操作对象已被占用'],
	ERROR_0x0006: ['0x0006', '请求操作对象已被禁用'],
	ERROR_0x0007: ['0x0007', '请求操作对象已被删除'],
	ERROR_0x0008: ['0x0008', '请求操作对象已被锁定'],
	ERROR_0x0009: ['0x0009', '请求操作对象已被过期'],
	ERROR_0x0010: ['0x0010', '请求操作对象已被停用'],
	ERROR_0x0011: ['0x0011', '请求操作对象已被取消'],
	ERROR_0x0012: ['0x0012', '请求操作对象已被拒绝'],
	ERROR_0x0019: ['0x0009', '未获取到授权项'],
	ERROR_0x0020: ['0x0010', '已达到授权场景数量上限:'],
	ERROR_0x0100: ['0x0100', '请求操作失败'],
};

module.exports = ErrorCodeMap;
