const path = require('path');
const fs = require('fs');
const koaStatic = require('koa-static');
const Logger = require('../utils/Logger');
// const mount = require('koa-mount');
const { Jimp } = require('jimp');
const Multer = require('@koa/multer');
const ErrorCodeMap = require('../common/constant/errorCode');
const initConfig = require('../../config/config.default');
const defaultConfig = initConfig();
const {
	adminStaticPath,
	appStaticPath,
	webStaticPath,
	businessUploadFile,
	businessUploadImg,
	outputFile,
} = defaultConfig.static;

const { staticOption } = defaultConfig.static;

const { host, port, commonAPI } = defaultConfig.app;

const fileUpload = Multer({
	dest: businessUploadFile,
});
const fileHandler = fileUpload.array('file', 10);
const imgUpload = Multer({
	dest: businessUploadImg,
});
// TODO: UI组件默认用file 这里之后需要修改成image
const imgHandler = imgUpload.array('file', 9);
// 10MB
const defaultImgSize = 10485760;

// const imgAutoResize = async (ctx, next) => {
// 	try {
// 		// 从multer获取images
// 		const imgList = ctx.req.images;
// 		for (let img of imgList) {
// 			const destPath = path.join(img.destination, img.filename);
// 			console.log(destPath);
// 			Jimp.read(img.path).then((image) => {
// 				image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
// 				image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
// 				image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
// 			});
// 		}
// 		await next();
// 	} catch (error) {
// 		Logger.error(error, ErrorCodeMap.ERROR_STATIC_MIDDLEWARE_IMG_RESIZE);
// 	}
// };

const imgResize = async (ctx, next) => {
	try {
		// 从multer获取images
		// 因为multer使用的是array 所以需要加s
		// 请注意用的是ctx.request 而不是 ctx.req
		// {
		// 	fieldname: 'file',
		// 	originalname: 'Screenshot 2021-01-28 154944.png',
		// 	encoding: '7bit',
		// 	mimetype: 'image/png',
		// 	destination: 'D:\\我的桌面\\myCode\\myNodeCode\\koa-cli\\config..\\app\\common\\business\\upload\\img',
		// 	filename: '65248256cc2fb77a9c2a76cd351ac212',
		// 	path: 'D:\\我的桌面\\myCode\\myNodeCode\\koa-cli\\config..\\app\\common\\business\\upload\\img\\65248256cc2fb77a9c2a76cd351ac212',
		// 	size: 350712
		//   }
		const imgList = ctx.request.files;
		try {
			for (let img of imgList) {
				const ext = path.extname(img.originalname);
				const targetPath = path.resolve(
					outputFile,
					img.size > defaultImgSize
						? `${img.filename}.jpg`
						: img.filename + ext,
				);
				img.fileURL = `${host}:${port}${commonAPI}/v1/upload/${path.basename(targetPath)}`;
				const resizeImage = await Jimp.read(img.path);
				if (img.size > defaultImgSize) {
					// 图片原始尺寸不变 质量缩减一半
					// .resize(原宽 * 0.5, Jimp.AUTO) // 宽度减半，高度按比例自动计算
					await resizeImage
						.quality(50)
						.resize(resizeImage.bitmap.width, resizeImage.bitmap.height)
						.write(targetPath);
				} else {
					await resizeImage.write(targetPath);
				}
				deleteImg(img.path);
			}
		} catch (error) {
			Logger.error(error, ErrorCodeMap.ERROR_STATIC_MIDDLEWARE_IMG_WRITE);
		}

		await next();
	} catch (err) {
		Logger.error(err, ErrorCodeMap.ERROR_STATIC_MIDDLEWARE_IMG_RESIZE);
	}
};

const isApp = async (ctx, next) => {
	const userAgent = ctx.headers['user-agent'];
	if (/mobile|android| iphone| ipad| app/i.test(userAgent)) {
		return ctx.isStaticBoost
			? koaStatic(appStaticPath, staticOption)
			: koaStatic(appStaticPath);
	} else {
		const url = ctx.url;
		if (url.includes('/admin/')) {
			return ctx.isStaticBoost
				? koaStatic(adminStaticPath, staticOption)
				: koaStatic(adminStaticPath);
		} else {
			await next();
			// 	return ctx.isStaticBoost
			// 		? koaStatic(webStaticPath, staticOption)
			// 		: koaStatic(webStaticPath);
			// }
		}
	}
};

const spaSupport = async (ctx) => {
	const url = ctx.url;
	let objectName = [];
	const map = {
		'/app/admin/': adminStaticPath,
		'/app/app/': appStaticPath,
		'/app/web/': webStaticPath,
	};
	try {
		for (const key in map) {
			if (url.includes(key)) {
				objectName.push(map[key]);
				const filePath = path.join(map[key], 'index.html');
				if (fs.existsSync(filePath)) {
					ctx.type = 'html';
					ctx.body = fs.createReadStream(filePath);
				}
			}
		}
	} catch (err) {
		Logger.error(err, ErrorCodeMap.ERROR_STATIC_MIDDLEWARE_SPA_SUPPORT);
	}
};

// 工具函数
// 上传到云存储之后可以删除掉upload和output图片
// 调用时deleteImg(imgUploadPath, imgOutput)
// deleteImg(imgUploadPath)
function deleteImg(...args) {
	for (let item of args) {
		fs.unlinkSync(item);
	}
}

module.exports = {
	isApp,
	spaSupport,
	imgResize,
	imgHandler,
	// imgAutoResize,
	fileHandler,
};
