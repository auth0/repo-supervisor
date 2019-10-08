/**
 * Skip all email addresses because they generate high entropy results.
 */
module.exports = s => !s.match(/^[\w\d+.-]+@[\w\d.-]+\.[\w]+$/i);
