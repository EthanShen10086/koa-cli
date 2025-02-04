module.exports = {
	// 在根目录下寻找.eslintrc.js文件，如果当前工作区打开的项目不是在根目录，则查找.eslintrc.js文件会失败，且eslint检查也不会生效
	root: true,
	env: {
		node: true,
		es6: true,
	},
	extends: [
		'eslint:recommended',
		'eslint-config-prettier',
		// Add Node.js specific rules
		'plugin:node/recommended'
	],
	plugins: [
		'prettier',
		'node'
	],
	// Use @babel/eslint-parser directly instead of deprecated babel-eslint
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@babel/eslint-parser',
	},
	rules: {
		'no-unused-vars': 'warn', // Changed to warn instead of off for better code quality
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', // Only allow console in development
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		// tab缩进 如果有问题就warn switch时一个空格为缩进
		indent: ['warn', 'tab', { SwitchCase: 1 }],
		'global-require': 2,
		'no-loop-func': 2,
		'no-useless-return': 2,
		'no-multi-assign': 2,
		'new-cap': [2, { newIsCap: true, capIsNew: false }],
		'no-multiple-empty-lines': [2, { max: 2 }],
		'eol-last': 2,
		'accessor-pairs': 2,
		'no-array-constructor': 2,
		'no-caller': 2,
		'no-delete-var': 2,
		'no-dupe-args': 2,
		'no-duplicate-imports': 2,
		'no-extend-native': 2,
		'no-extra-bind': 2,
		'no-global-assign': [2, { exceptions: ['Object'] }],
		'no-implied-eval': 2,
		'no-irregular-whitespace': 2,
		'no-iterator': 2,
		'no-label-var': 2,
		'no-labels': 2,
		'no-lone-blocks': 2,
		'no-multi-str': 2,
		'no-new': 2,
		'no-new-func': 2,
		'no-new-object': 2,
		'no-new-require': 2,
		'no-new-symbol': 2,
		'no-new-wrappers': 2,
		'no-octal': 2,
		'no-octal-escape': 2,
		'no-path-concat': 2,
		'no-proto': 2,
		'no-self-compare': 2,
		'no-shadow-restricted-names': 2,
		'no-tabs': 2,
		'no-template-curly-in-string': 2,
		'no-throw-literal': 2,
		'no-trailing-spaces': 2,
		'no-undef-init': 2,
		'no-unmodified-loop-condition': 2,
		'no-unneeded-ternary': 2,
		'no-unreachable': 2,
		'no-unsafe-negation': 2,
		'no-useless-call': 2,
		'no-useless-computed-key': 2,
		'no-useless-constructor': 2,
		'semi-spacing': 2,
		'no-unexpected-multiline': 2,
		// Add Node.js specific rules
		'node/no-unsupported-features/es-syntax': ['error', {
			version: '>=14.0.0',
			ignores: ['modules']
		}],
		'node/no-missing-require': 'error',
		'node/no-deprecated-api': 'error'
	},
};
