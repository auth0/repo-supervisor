/**
 * Skip all email addresses because they generate high entropy results.
 **/
module.exports = s => !s.match(/^[a-z0-9+_-]+@[a-z._-]+\.[a-z]+$/i);
