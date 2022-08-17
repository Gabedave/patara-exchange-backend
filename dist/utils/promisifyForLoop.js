"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function promisifyForLoopAsync(iterable, asyncfunc_) {
    return await Promise.all(iterable.map(async (item) => {
        return await asyncfunc_(item);
    }));
}
exports.default = promisifyForLoopAsync;
