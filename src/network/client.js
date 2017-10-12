let methods = ['get', 'post', 'put', 'delete'];

let client = {};

methods.forEach((method) => {
    client[method] = ({url, params = {}, headers = {}}) => new Promise(async (resolve, reject) => {
        let headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });

        params._t = new Date().getTime().toString(36);

        let queryString = [];

        Object.keys(params).forEach((key) => {
            queryString.push(`${key}=${params[key]}`);
        });

        url = `${url}?${queryString.join('&')}`;

        let request = new Request(url, {
            method: method.toUpperCase(),
            headers
        });

        let error;
        try {
            let response = await fetch(url, request);

            let {status} = response;

            if (status >= 400) {
                error = {
                    errorMsg: '网络异常'
                };
            }else {
                let responseJson = await response.json();

                let {success, resultTips: errorMsg} = responseJson;

                if (success) {
                    resolve(responseJson.result);
                } else {
                    error = {
                        errorMsg
                    };
                }
            }
        } catch (e) {
            error = e;
        } finally {
            if (error) {
                reject(error);
            }
        }
    });
});

export default client;
