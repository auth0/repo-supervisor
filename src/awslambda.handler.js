module.exports = fn => (event, context, callback) => {
  // context.callbackWaitsForEmptyEventLoop = false;

  fn(event).then((res) => {
    let response;

    switch (typeof res) {
      case 'object':
        response = {
          statusCode: res.statusCode || 200,
          headers: res.headers || {},
          body: res.body
        };
        break;

      default:
        response = {
          statusCode: 200,
          body: res
        };
        break;
    }

    return callback(null, response);
  }).catch(error => callback(error));
};
