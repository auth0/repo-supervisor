/**
 * Skip all strings containing non ASCII characters.
 *
 * Space " " (0x20) character is the first printable one in the ASCII table.
 * The last printable one is tilde "~" (0x7E). This is the reason for defined
 * range in the regular expression. We do not take UTF characters into account
 * as those are not going to be a part of secret in vast majority of cases.
 * It allows to reduce false positives significantly.
 */
module.exports = s => !s.match(/[^ -~]+/);
