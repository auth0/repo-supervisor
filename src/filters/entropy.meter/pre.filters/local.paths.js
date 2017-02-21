'use strict';

const path = require('path');

/**
 * Skip strings where there is a file or directory path.
 * Those strings presents an entropy level close to that returned
 * for secrets.
 *
 * Examples:
 * - [3.28] /tmp/foo/bar.txt
 * - [3.46] ../libraries/go.js
 **/
module.exports = s => !path.parse(s).dir;
