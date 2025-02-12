const ErrorCodeMap = {
	ERROR_Default_ERROR: ['0x0000', '后端程序未知错误'],
	ERROR_PARAMS_ILLEGAL: ['0x0002', '请求参数非法'],
	ERROR_OBJECT_EXIST: ['0x0003', '请求操作对象已存在'],
	ERROR_OBJECT_NOT_EXIST: ['0x0004', '请求操作对象不存在'],
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
	ERROR_PASSWORD_ILLEGAL: [
		'0x0100',
		'密码必须包含大小写字母、数字和特殊字符，且长度为8-20位',
	],
	ERROR_USERNAME_ILLEGAL: ['0x0101', '用户名不能为空'],
	ERROR_DATABASE_INIT: ['0x0200', '数据库连接失败'],
	ERROR_SQL_ERROR: ['0x0201', 'SQL语句错误'],
	ERROR_SQL_PARAMS_ILLEGAL: ['0x0202', 'SQL参数传递非法'],
	ERROR_SQL_OUT_RANGE: ['0x0203', 'SQL获取数据超出容量'],
	ERROR_ROUTER_INIT: ['0x0300', '路由初始化失败'],
};

module.exports = ErrorCodeMap;
