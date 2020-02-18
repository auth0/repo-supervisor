const HEADER = {
  CONTENT_TYPE_HTML: { 'Content-Type': 'text/html' },
  CONTENT_TYPE_JSON: { 'Content-Type': 'application/json' },
  CONTENT_TYPE_TEXT: { 'Content-Type': 'text/plain' }
};
const STATUS_CODE = {
  ERROR: 400,
  SUCCESS: 200
};

const response = (message, httpCode = STATUS_CODE.SUCCESS, httpContentType = HEADER.CONTENT_TYPE_TEXT) => {
  const payload = {
    headers: httpContentType,
    statusCode: httpCode,
    body: (httpContentType === HEADER.CONTENT_TYPE_JSON ? JSON.stringify(message) : (message || '').toString())
  };

  return payload;
};

module.exports = {
  response,
  HEADER,
  STATUS_CODE
};
