require('./fetchLoader');
const Fetcher = require('./fetcher');
const users = require('./users');
const games = require('./games');
const { pather } = require('./utils');

module.exports = async ({ timeout = 60, apiKey } = {}) => {
  let cache = {};

  // init fetcher
  const fetcher = Fetcher(cache, timeout * 1000, apiKey);

  // init cache purger
  const purgeCache = cache => () => {
    Object.entries(cache).forEach(i => clearTimeout(i[1].timeout));
    Object.keys(cache).forEach(k => delete cache[k]);
  };

  // init lib
  return {
    fetcher,
    users: users(fetcher),
    games: games(fetcher),
    purgeCache: purgeCache(cache)
  };
};
