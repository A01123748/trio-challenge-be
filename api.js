const axios = require('axios').default;

// const CONTACTS_API = process.env.CONTACTS_API;
const API_TOKEN = process.env.API_TOKEN;

const callApi = (method = 'post', url, data = {}, params = {}) => 
    axios({
        method,
        url,
        data,
        params,
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
        },
        responseType: 'json',
    });

// export default callApi;
module.exports.callApi = callApi;