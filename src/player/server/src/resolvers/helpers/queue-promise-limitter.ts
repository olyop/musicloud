import pLimit from "p-limit";

export const queuePromiseLimitter = pLimit(100);
