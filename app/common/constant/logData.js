const LogInfo = {
	// 模块（与业务文件夹controller相对应）
	MODULE_STATIC: 'log.module.static',
	MODULE_USER: 'log.module.user',

	// 动作
	ACTION_INIT: 'log.action.init',
	ACTION_ADD: 'log.action.add',
	ACTION_DEL: 'log.action.del',
	ACTION_MOD: 'log.action.mod',
	ACTION_QUERY: 'log.action.query',
	ACTION_SEARCH: 'log.action.search',
	ACTION_SAVE: 'log.action.save',
	ACTION_UPLOAD: 'log.action.upload',
	// 对象
	OBJECT_USER_ITEM: 'log.objectType.userItem',
	OBJECT_IMAGE: 'log.objectType.image',
	OBJECT_FILE: 'log.objectType.file',
};

module.exports = {
	LogInfo,
};
