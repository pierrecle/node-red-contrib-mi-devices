"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
    static get NODES_PREFIX() {
        let packageJson = require(`${__dirname}/../../package`);
        return packageJson.config.nodes_prefix;
    }
    ;
}
exports.Constants = Constants;
