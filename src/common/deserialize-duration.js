"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const deserializeDuration = (duration, wordFormat = false) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    if (wordFormat) {
        return `${minutes} minutes`;
    }
    else {
        return `${minutes}:${seconds <= 9 ? "0" : ""}${seconds}`;
    }
};
exports.default = deserializeDuration;
