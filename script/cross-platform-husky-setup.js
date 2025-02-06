const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const huskyDir = path.join(process.cwd(), '.husky');

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

// 设置文件权限
try {
	if (process.platform !== 'win32') {
		// 在Unix系统(Mac/Linux)上设置执行权限
		execSync(`chmod +x "${path.join(huskyDir, 'pre-commit')}"`);
		execSync(`chmod +x "${path.join(huskyDir, 'commit-msg')}"`);
	}
} catch (error) {
	console.warn('Warning: Could not set execute permissions on husky hooks.');
	console.warn('If you are on Unix-like system, you may need to manually run:');
	console.warn(`chmod +x "${path.join(huskyDir, 'pre-commit')}"`);
	console.warn(`chmod +x "${path.join(huskyDir, 'commit-msg')}"`);
	console.error(error);
}

// 初始化husky
try {
	execSync('pnpm husky install');
} catch (error) {
	console.warn('Warning: Could not initialize husky.');
	console.warn('You may need to manually run: pnpm husky install');
	console.error(error);
}

console.log('Husky hooks setup completed successfully!');
