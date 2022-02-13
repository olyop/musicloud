"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastifyListenCallback = (error, address) => {
    if (error) {
        console.error(error);
    }
    else {
        if (process.env.NODE_ENV === "production") {
            console.log(address);
        }
    }
};
exports.default = fastifyListenCallback;
