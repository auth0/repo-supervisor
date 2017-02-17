const url = require('url');

/**
 * Skip all URLs but leave those with authentication parameters.
 * Reason behind that is the common pattern usage like: tcp://admin:123456@mongodb.com/
 **/
module.exports = s => (url.parse(s).host ? url.parse(s).auth : true);
