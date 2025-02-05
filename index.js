const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const mount = require('koa-mount');
const app = new Koa();
const defaultConfig = require('./config/config.default')

// 解析参数
const { bodyParser } = require('@koa/bodyparser');
const koaStatic = require('koa-static');
const Router = require('@koa/router');
const staticRouter = new Router();

// 解析路由
const adminRouter = require(path.join(__dirname, './app/router/admin'))

// 静态资源 + SPA文件 路由支持
app.use(defaultConfig.contextPath)
