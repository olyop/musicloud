"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_S3_URL = exports.PAGINATION_PAGE_SIZE = exports.QUEUE_PAGE_SIZE = exports.VERSION = void 0;
const metadata_1 = require("./metadata");
exports.VERSION = "1.0.0";
exports.QUEUE_PAGE_SIZE = 15;
exports.PAGINATION_PAGE_SIZE = 30;
exports.BASE_S3_URL = `https://${metadata_1.NAME}.s3-${process.env.AWS_REGION}.amazonaws.com`;
