/* eslint-disable @typescript-eslint/dot-notation */
import { NAME } from "./metadata"

export const VERSION = "1.0.0"
export const QUEUE_PAGE_SIZE = 15
export const PAGINATION_PAGE_SIZE = 30
export const BASE_S3_URL = `https://${NAME}.s3-${process.env["AWS_REGION"]!}.amazonaws.com`