const connection = require('../../plugin/db');
const User = require('../../model/user');

const BaseService = require('../base.service');
const { BusinessError } = require('../../common/exception/AppError');
const ErrorCodeMap = require('../../common/constant/errorCode');
const {
	snowFlakeGenerator,
	snowflakeIdToId,
	filterSensitiveFields,
} = require('../../utils');

// service 执行sql语句
class UserService extends BaseService {
	constructor() {
		super(User);
	}
	async add(userName, password) {
		const id = snowFlakeGenerator.nextId();
		try {
			const sql = `INSERT INTO user (userName, password, id) VALUES (?, ?, ?)`;
			const res = await connection.execute(sql, [userName, password, id]);
			// 返回成功信息
			return res[0];
		} catch (e) {
			console.error(e);
			throw new BusinessError(ErrorCodeMap.ERROR_SQL_ERROR);
		}
	}
	async getUserByUsername(userName) {
		try {
			const sql = `
            SELECT 
                id,
                userName, 
                createAt, 
                updateAt, 
                gender, 
                birthday, 
                email, 
                avatarURL 
            FROM user 
            WHERE userName = ?`;
			const res = await connection.execute(sql, [userName]);
			return res[0].map((item) => ({
				...item,
				id: snowflakeIdToId(item.id),
			}));
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
						id: snowflakeIdToId(item.id),
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

	// async update(id) { }
	// async delete(id) {

	// }
	// async batchDelete(idList) { }
}
module.exports = UserService;
