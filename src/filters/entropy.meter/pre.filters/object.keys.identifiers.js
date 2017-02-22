/**
 * Remove strings which look like object keys but leave its values.
 * Example:
 * - Object key name is "AMAZON_CLIENT_SECRET"
 * - Value for that key: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
 *
 * Entropy level for key name is "3.584" and for its value it's "3.785".
 * To remove false positives we need to get rid off object keys.
 * It will not detect secrets in a form of "FOO_BAR_SECRET_ABCD".
 **/
module.exports = s => !s.match(/^([A-Z]+_){1,}[A-Z]+$/g);
