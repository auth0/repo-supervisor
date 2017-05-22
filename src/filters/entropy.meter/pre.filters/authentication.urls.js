/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
import url from 'url';

/**
 * Skip all URLs but leave those with authentication parameters.
 * Reason behind that is the common pattern usage like: tcp://admin:123456@mongodb.com/
 **/
module.exports = (s) => {
  let auth;

  try {
    if (url.parse(s).host) {
      auth = url.parse(s).auth || false;
    }
  } catch (e) {
    // It's not a valid URL, process it further.
    return true;
  }

  if (auth === ':') {
    // Empty authentication params, skip from processing.
    return false;
  }

  if (typeof auth === 'undefined') {
    return true;
  }

  return auth;
};
