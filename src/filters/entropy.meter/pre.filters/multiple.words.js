/**
 * Skip all strings with space " ", it will help to avoid false positives.
 */
module.exports = s => !s.includes(' ');
