import fetch from 'axios';
import qs from 'qs';

const methods = ['get', 'post', 'put', 'patch', 'del', 'head'];

class Client {
  constructor() {
    methods.forEach((method) => {
      this[method] = Client.requestWrapper(method);
    });
  }

  static requestWrapper(method) {
    async function decorateRequest({ url, data, query }) {
      const queryStrings = qs.stringify({
        ...query,
        client_id: '853fdb79a14a9ed748ec9fe482e859dd',
      });
      return {
        request: {
          method,
          headers: { 'Content-Type': 'application/json; charset=UTF-8' },
          data: JSON.stringify(data),
        },
        requestURL: `https://api.soundcloud.com/users/603807156/tracks?client_id=853fdb79a14a9ed748ec9fe482e859dd`,
      };
    }

    function checkStatus(response, resolve, reject) {
      const { status, data } = response;
      if (status >= 200 && status < 300) {
        return resolve(data);
      }
      return reject(data);
    }

    return async ({ url, data = null, query }) => {
      const { requestURL, request } = await decorateRequest({
        method,
        url,
        data,
        query,
      });
      return new Promise((resolve, reject) => {
        fetch(requestURL, request)
          .then(response => checkStatus(response, resolve, reject))
          .catch(error => checkStatus(error, resolve, reject))
          .catch(reject);
      });
    };
  }
}

export default new Client();
