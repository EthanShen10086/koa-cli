const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const huskyDir = path.join(process.cwd(), '.husky');

// 控制台输出颜色
const colors = {
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	reset: '\x1b[0m',
};

function log(message, type = 'info') {
	const color = type === 'success' ? colors.green : colors.yellow;
	console.log(`${color}${message}${colors.reset}`);
}

try {
	// 确保.husky目录存在
	if (!fs.existsSync(huskyDir)) {
		fs.mkdirSync(huskyDir, { recursive: true });
	}

	// 创建pre-commit钩子
	const preCommitContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint-staged
`;

	// 创建commit-msg钩子
	const commitMsgContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm dlx commitlint --edit "$1"
`;

	// 写入文件
	fs.writeFileSync(path.join(huskyDir, 'pre-commit'), preCommitContent);
	fs.writeFileSync(path.join(huskyDir, 'commit-msg'), commitMsgContent);

	// 根据操作系统设置文件权限
	if (process.platform !== 'win32') {
		try {
			execSync(`chmod +x "${path.join(huskyDir, 'pre-commit')}"`);
			execSync(`chmod +x "${path.join(huskyDir, 'commit-msg')}"`);
			log('Successfully set execute permissions for husky hooks', 'success');
		} catch (error) {
			log('Note: Could not set execute permissions on husky hooks.');
			log('If you are on Unix-like system, you may need to manually run:');
			log(`chmod +x "${path.join(huskyDir, 'pre-commit')}"`);
			log(`chmod +x "${path.join(huskyDir, 'commit-msg')}"`);
			console.error(error, 'permission error');
		}
	}

	// 初始化husky
	try {
		execSync('pnpm husky install', { stdio: 'inherit' });
	} catch (error) {
		log('Note: Could not initialize husky.');
		log('You may need to manually run: pnpm husky install');
		console.error(error, 'init husky error');
	}
	handleExit();
} catch (error) {
	handleExit(error);
}

function handleExit(error) {
	if (error) {
		console.error('Error setting up husky hooks:', error);
		// 设置 process.exitCode 而不是直接调用 process.exit()
		process.exitCode = 1;
	} else {
		log('✨ Husky hooks setup completed successfully! ✨', 'success');
		process.exitCode = 0;
	}
}
