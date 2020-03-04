const config = require('./../../../../config/main.json').render.obfuscate;

module.exports = str => str.substring(config.stringStartPos, config.stringEndPos) +
                        (config.paddingChar).repeat(config.paddingLength);
