"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const color = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    gray: '\x1b[90m',
};
const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${color.green}[FINISH]${color.reset} ${color.cyan}${req.method}${color.reset} ${req.originalUrl} - ${color.yellow}${res.statusCode}${color.reset} in ${color.magenta}${duration}ms${color.reset}`);
        console.log(`${color.gray}[BODY]${color.reset} ${JSON.stringify(req.body)}`);
        console.log(`${color.gray}[PARAMS]${color.reset} ${JSON.stringify(req.params)}`);
        console.log(`${color.gray}[QUERY]${color.reset} ${JSON.stringify(req.query)}`);
    });
    res.on('close', () => {
        const duration = Date.now() - start;
        console.warn(`${color.red}[CLOSE]${color.reset} ${req.method} ${req.originalUrl} - connection closed after ${color.magenta}${duration}ms${color.reset}`);
    });
    req.on('aborted', () => {
        console.warn(`${color.red}[ABORTED]${color.reset} ${req.method} ${req.originalUrl} - client aborted the request`);
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
