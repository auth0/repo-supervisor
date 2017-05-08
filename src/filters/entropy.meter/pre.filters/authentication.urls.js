/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
import url from 'url';

/**
 * Skip all URLs but leave those with authentication parameters.
 * Reason behind that is the common pattern usage like: tcp://admin:123456@mongodb.com/
 **/
module.exports = (s) => {
  try {
    if (url.parse(s).host) {
      return url.parse(s).auth;
    }
  } catch (e) {}

  return true;
};
