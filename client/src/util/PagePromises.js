class PagePromises {
  static concatPages(spotifyApi, promiseThrottle, promise) {
    function stripParameters(href) {
      var u = new URL(href);
      return u.origin + u.pathname;
    }

    function fetchGeneric(results, offset, limit) {
      return spotifyApi.getGeneric(
        stripParameters(results.href) + "?offset=" + offset + "&limit=" + limit
      );
    }

    return new Promise(function(resolve, reject) {
      promise
        .then(function(results) {
          const promises = [promise]; // add the initial page
          let offset = results.limit + results.offset; // start from the second page
          const limit = results.limit;
          while (results.total > offset) {
            const q = promiseThrottle.add(
              fetchGeneric.bind(this, results, offset, limit)
            );
            promises.push(q);
            offset += limit;
          }
          resolve(promises);
        })
        .catch(function() {
          reject([]);
        });
    });
  }
}

export default PagePromises;
