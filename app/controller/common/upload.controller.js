const BaseController = require('../base.controller');
const { LogInfo } = require('../../common/constant/logData');
const Logger = require('../../utils/Logger');
const UploadService = require('../../service/common/upload.service');
const initConfig = require('../../../config/config.default');
const fs = require('fs');
const path = require('path');
const defaultConfig = initConfig();
const { outputFile } = defaultConfig.static;
class UploadController extends BaseController {
	constructor(ctx) {
		super(ctx);
		this.uploadService = new UploadService();
	}
	async batchAdd() {
		let objectName = [];
		let actionDetail = [];
		const uploadList = this.ctx.request.files;
		// 存储的位置 public/1e9dd1da14281299b64f3dbda77cb570.png
		// {
		//     fieldname: 'file',
		//     originalname: 'Screenshot 2021-01-28 154944.png',
		//     encoding: '7bit',
		//     mimetype: 'image/png',
		//     destination: 'D:\\我的桌面\\myCode\\myNodeCode\\koa-cli-test\\app\\common\\business\\upload\\img',
		//     filename: 'ba99d7369efcb9a9fd9ea9e5c760c074',
		//     path: 'D:\\我的桌面\\myCode\\myNodeCode\\koa-cli-test\\app\\common\\business\\upload\\img\\ba99d7369efcb9a9fd9ea9e5c760c074',
		//     size: 350712,
		//     fileURL: 'http://localhost:8888/yyh-app/api/common/v1/upload/3593bacfedd841c9f52a040ce9197f21.png'
		//   }
		const result = uploadList.map((file) => {
			const imageInfo = {
				fileURL: file.fileURL,
				filename: file.filename,
				mimetype: file.mimetype,
				size: file.size,
				userId: this.ctx.user.id,
			};
			actionDetail.push('UploadController add' + JSON.stringify(imageInfo));
			objectName.push(file.filename);
			return imageInfo;
		});

		try {
			await this.uploadService.batchAdd(result);
			this.feedback({
				code: '0',
				data: result,
			});
		} catch (err) {
			return this.errorHandle(err);
		} finally {
			let log = {
				module: LogInfo.MODULE_FILE,
				objectType: LogInfo.OBJECT_IMAGE,
				objectName: objectName.join(','),
				action: LogInfo.ACTION_MOD,
				actionDetail: actionDetail.join(','),
			};
			Logger.writeLog(log);
		}
	}
	async getFile() {
		// 当前登录用户id
		const { id } = this.ctx.user;
		const fileInfo = await this.uploadService.findFileByUserId(id);
		this.ctx.response.set('content-type', fileInfo.mimetype);
		// 服务器存储文件的地方
		this.ctx.body = fs.createReadStream(
			path.resolve(outputFile),
			path.basename(fileInfo.fileURL),
		);
	}

	async getFileById() {
		// 获取:id的参数
		const { id } = this.ctx.params;
		const fileInfo = await this.uploadService.findFileById(id);

		this.ctx.response.set('content-type', fileInfo.mimetype);
		// 服务器存储文件的地方
		this.ctx.body = fs.createReadStream(
			path.resolve(outputFile, path.basename(fileInfo.fileURL)),
		);
	}
}

module.exports = UploadController;
