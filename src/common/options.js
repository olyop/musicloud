"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALGOLIA_OPTIONS = exports.CORS_OPTIONS = exports.HELMET_OPTIONS = exports.PG_POOL_OPTIONS = exports.FASTIFY_SERVER_OPTIONS = void 0;
exports.FASTIFY_SERVER_OPTIONS = {
    connectionTimeout: 5 * 1000,
};
exports.PG_POOL_OPTIONS = {
    max: 30,
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
    origin: "*",
};
exports.ALGOLIA_OPTIONS = [
    process.env.ALGOLIA_APPLICATION_ID,
    process.env.ALGOLIA_ADMIN_API_KEY,
];
