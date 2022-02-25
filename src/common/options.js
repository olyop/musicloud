"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALGOLIA_OPTIONS = exports.CORS_OPTIONS = exports.HELMET_OPTIONS = exports.PG_POOL_OPTIONS = exports.FASTIFY_SERVER_OPTIONS = void 0;
const IS_PROD = process.env.NODE_ENV === "production";
const fastifyLogger = {
    prettyPrint: {
        translateTime: true,
        messageFormat: "{msg} [{req.method} {req.url}]",
        ignore: "pid, hostname, reqId, responseTime, req, res",
    }
};
exports.FASTIFY_SERVER_OPTIONS = {
    bodyLimit: 20971520,
    connectionTimeout: 5 * 1000,
    logger: IS_PROD && fastifyLogger,
};
exports.PG_POOL_OPTIONS = {
    max: 60,
    parseInputDatesAsUTC: true,
    idleTimeoutMillis: 30 * 1000,
    connectionTimeoutMillis: 5 * 1000,
    user: process.env.AWS_RDS_USERNAME,
    host: process.env.AWS_RDS_ENDPOINT,
    password: process.env.AWS_RDS_PASSWORD,
    database: process.env.AWS_RDS_DATABASE,
};
exports.HELMET_OPTIONS = {
    contentSecurityPolicy: false,
};
exports.CORS_OPTIONS = {
    maxAge: 60 * 60,
    methods: ["GET", "POST"],
    origin: IS_PROD ? "https://musicloud-app.com" : "http://127.0.0.1:3001",
};
exports.ALGOLIA_OPTIONS = [
    process.env.ALGOLIA_APPLICATION_ID,
    process.env.ALGOLIA_ADMIN_API_KEY,
];
