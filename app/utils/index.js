import { Base64 } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';
export function isFileBase64(fileSrc) {
	return fileSrc && fileSrc.startsWith('data:image/jpeg;base64');
}

export function getUuid() {
	return uuidv4();
}

// base64 加密
export function base64Encode(value) {
	return Base64.encode(value);
}

// base64 解密
export function base64Decode(value) {
	return Base64.decode(value);
}

// base64 解密
export function base64DataToImage(base64Data) {
	return 'data:image/png;base64,' + base64Data;
}
