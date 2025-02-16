const ErrorCodeMap = require('../../common/constant/errorCode');
const { BusinessError } = require('../../common/exception/AppError');
const Upload = require('../../model/upload');
const connection = require('../../plugin/db');
const BaseService = require('../base.service');
const { snowFlakeGenerator } = require('../../utils');
class UploadService extends BaseService {
	constructor() {
		super(Upload);
	}
	async add(addParams) {
		const allowedFieldsList = [
			'filename',
			'mimetype',
			'size',
			'userId',
			'fileURL',
		];
		const filteredParams = Object.keys(addParams)
			.filter((key) => allowedFieldsList.includes(key))
			.reduce((obj, key) => {
				obj[key] = addParams[key];
				return obj;
			}, {});
		const id = snowFlakeGenerator.nextId();
		const insertParamList = Object.keys(filteredParams).join(',');
		const valueParamList = Object.keys(filteredParams)
			.map(() => '?')
			.join(',');
		const queryParamList = Object.values(filteredParams);
		try {
			const sql = `INSERT INTO upload (id, ${insertParamList}) VALUES (?, ${valueParamList})`;
			const res = await connection.execute(sql, [id, ...queryParamList]);
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	async batchAdd(fileList) {
		const allowedFieldsList = [
			'filename',
			'mimetype',
			'size',
			'userId',
			'fileURL',
		];

		try {
			const values = [];
			const placeholders = [];

			fileList.forEach((file) => {
				const id = snowFlakeGenerator.nextId();
				// 确保包含所有允许字段 (参考 UserService 25-30 行过滤逻辑)
				const filtered = allowedFieldsList.reduce((obj, key) => {
					obj[key] = file[key] || null; // 处理缺失字段
					return obj;
				}, {});

				values.push(id, ...allowedFieldsList.map((k) => filtered[k]));
				placeholders.push('(?,?,?,?,?,?)'); // 固定6个占位符
			});

			// 构建SQL (参考 UserService 40-43 行格式)
			const fields = ['id', ...allowedFieldsList].join(',');
			const sql = `INSERT INTO upload (${fields}) VALUES ${placeholders.join(',')}`;
			const [res] = await connection.execute(sql, values);
			return res;
		} catch (error) {
			console.error(error);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	async findFileByUserId(userId) {
		try {
			const sql = `
            SELECT *
            FROM upload 
            WHERE userId = ?`;
			const [res] = await connection.execute(sql, [userId]);
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}

	async findFileById(imgId) {
		try {
			const sql = `
            SELECT *
            FROM upload 
            WHERE id = ?`;
			const [res] = await connection.execute(sql, [imgId]);
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
}

module.exports = UploadService;
