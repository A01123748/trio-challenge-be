const axios = require('axios').default;

const callApi = (method = 'post', url, data = {}, params = {}, headers = {}) => 
    axios({
        method,
        url,
        data,
        params,
        headers,
        responseType: 'json',
    });

module.exports.callApi = callApi;