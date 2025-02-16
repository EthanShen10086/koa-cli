const connection = require('../../plugin/db');
const User = require('../../model/user');
const BaseService = require('../base.service');
const { BusinessError } = require('../../common/exception/AppError');
const ErrorCodeMap = require('../../common/constant/errorCode');
const { snowFlakeGenerator, filterSensitiveFields } = require('../../utils');

// service 执行sql语句
class UserService extends BaseService {
	constructor() {
		super(User);
	}
	async add(addParams) {
		// 只对model中定义好的字段进行修改
		// 如果使用ORM ORM自动会在反序列化的时候进行过滤
		const allowedFieldsList = [
			'userName',
			'password',
			'email',
			'gender',
			'birthday',
			'avatarURL',
		];
		// 过滤非法字段
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
			// `INSERT INTO user (userName, password, id) VALUES (?, ?, ?)`
			const sql = `INSERT INTO user (id, ${insertParamList}) VALUES (?, ${valueParamList})`;
			const res = await connection.execute(sql, [id, ...queryParamList]);
			// 返回成功信息
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	// 内部使用
	async _findByUsername(userName) {
		try {
			const sql = `
            SELECT *
            FROM user 
            WHERE userName = ?`;
			const [res] = await connection.execute(sql, [userName]);
			// userName是唯一的 所以直接用res[0] 多个结果需要map
			return res.length > 0 ? res[0] : res;
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	async findById(id) {
		try {
			const sql = `
            SELECT *
            FROM user 
            WHERE id = ?`;
			const [res] = await connection.execute(sql, [id]);
			// id是唯一的 所以直接用res[0] 多个结果需要map
			return filterSensitiveFields(res[0]);
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	// 前端传递的查询字段queryParams
	async list(
		pageNo,
		pageSize,
		queryParams = {},
		sortField = 'createAt',
		sortOrder = 'DESC',
	) {
		try {
			// 参数校验放在controller
			// 根据排序字段list排序
			const sortFieldList = ['createAt', 'updateAt', 'userName'];
			if (!sortFieldList.includes(sortField)) {
				sortField = 'createAt';
			}
			// list排序顺序
			const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
			// 构建sql条件语句的参数
			const whereParamList = [];
			// 构建sql执行传递的参数
			const queryParamList = [];
			if (queryParams?.userName) {
				// 模糊查询
				whereParamList.push('userName LIKE ?');
				queryParamList.push(`%${queryParams.userName}%`);
			}
			if (queryParams?.gender) {
				whereParamList.push('gender  = ?');
				queryParamList.push(queryParams.gender);
			}
			if (queryParams?.email) {
				whereParamList.push('email  = ?');
				queryParamList.push(queryParams.email);
			}
			// 添加时间范围查询
			if (queryParams?.startTime && queryParams?.endTime) {
				whereParamList.push('createAt BETWEEN ? AND ?');
				// 2024-01-01T00:00:00
				queryParamList.push(
					new Date(queryParams.startTime)
						.toISOString()
						.slice(0, 19)
						.replace('T', ' '),
					new Date(queryParams.endTime)
						.toISOString()
						.slice(0, 19)
						.replace('T', ' '),
				);
			}

			const whereSQL =
				whereParamList.length > 0
					? `WHERE ${whereParamList.join(' AND ')}`
					: '';

			// 获取total 使用索引加速
			const countSQL = `SELECT COUNT(*) AS total FROM user ${whereSQL}`;
			const [countRes] = await connection.execute(countSQL, queryParamList);
			const total = countRes[0].total;
			// 总共有多少页
			const totalPage = Math.ceil(total / pageSize);
			// 页码越界 用最后一页的数据
			if (pageNo > total && totalPage > 0) {
				pageNo = totalPage;
			}
			// 分页偏移量 就是说跳过offset条数据查
			const offset = (pageNo - 1) * pageSize;

			// 如果pageNo过大，就调整offset为最后一页的起始位置。
			// BIN_TO_UUID(id) AS id,
			const sql = `
			SELECT
			*
			FROM user 
			${whereSQL}
			ORDER BY ${sortField} ${order}
			LIMIT ? OFFSET ?`;
			const [res] = await connection.execute(sql, [
				...queryParamList,
				String(pageSize),
				String(offset),
			]);
			return {
				list: res.map((item) => {
					return filterSensitiveFields({
						...item,
					});
				}),
				paegNo: Number(pageNo),
				pageSize: Number(pageSize),
				total: Number(total),
			};
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}

	async update(id, updateParams) {
		try {
			const allowedFieldsList = [
				'userName',
				'password',
				'email',
				'gender',
				'birthday',
				'avatarURL',
			];
			// 过滤非法字段
			const filteredParams = Object.keys(updateParams)
				.filter((key) => allowedFieldsList.includes(key))
				.reduce((obj, key) => {
					obj[key] = updateParams[key];
					return obj;
				}, {});

			const setParamsList = [];
			const queryParamsList = [];
			Object.entries(filteredParams).forEach(([key, value]) => {
				setParamsList.push(`${key} = ?`);
				queryParamsList.push(value);
			});
			queryParamsList.push(id);
			// `UPDATE moment SET content = ? WHERE id = ?;`;
			const sql = `UPDATE user SET ${setParamsList.join(', ')} WHERE id = ?`;
			const res = await connection.execute(sql, queryParamsList);
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	async delete(id) {
		try {
			const sql = `DELETE FROM user WHERE id = ?`;
			const res = await connection.execute(sql, [id]);
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	async batchDelete(idList) {
		try {
			const inSQL = idList.map(() => '?').join(',');
			// [1, 2, 3] => '?,?,?'
			const sql = `DELETE FROM user WHERE id IN (${inSQL})`;
			const res = await connection.execute(sql, idList);
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
}
module.exports = UserService;
