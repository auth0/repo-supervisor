/**
 * Skip all potential regular expressions.
 */
module.exports = s => !s.match(/\[a-z\]|\[0-9\]|(\(\?:[^]+\))|\[a-z0-9\]|\[a-z0-9_-\]|\[0-9A-Fa-f\]|\[a-fA-F0-9\]/i);
