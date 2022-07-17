const axios = require('axios').default;

const callApi = (url, method = 'get', data = {}, params = {}, headers = {}) => axios({
  method,
  url,
  data,
  params,
  headers,
  responseType: 'json',
});

module.exports.callApi = callApi;
