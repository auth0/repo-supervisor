/**
 * Skip all strings short string with length not exceeding $minStrLength variable
 */
module.exports = (s, config) => s.length >= config.minStringLength;
