require('./fetchLoader');
const merge = require('lodash/merge');

const defaultHeaders = {
  headers: {
    'content-type': 'application/json',
    'accept': 'application/json'
  }
};

const get = (cache, timeout, apiKey) => async (path, options = {}) => {
  if (typeof cache[path] !== 'undefined') return cache[path].data;

  const url = new URL(path);
  url.searchParams.append("key", apiKey);

  const resp = await fetch(url.toString(), merge(options, { headers: { } }, defaultHeaders));
  const json = await resp.json();

  // saves timeoutID for purging timers
  const timeoutID = setTimeout(() => { delete cache[path]; }, timeout);

  cache[path] = {
    timeout: timeoutID,
    data: json
  };
  return json;
}

module.exports = (cache, timeout, apiKey) => ({
  get: get(cache, timeout, apiKey)
});
