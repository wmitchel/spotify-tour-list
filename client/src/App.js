import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import PromiseThrottle from 'promise-throttle';

import Login from './components/Login';
import NowPlaying from './components/NowPlaying';
import Playlists from './components/Playlists';

const spotifyApi = new SpotifyWebApi();
const promiseThrottle = new PromiseThrottle({ requestsPerSecond: 5 });

class App extends Component {
  constructor(props) {
    super(props);

    this.getNowPlaying = this.getNowPlaying.bind(this);

    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      spotifyApi.getMe().then((res) => {
        this.setState({
          userId: res.id
        })
      });
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: {name : 'Not Checked', albumArt: ''},
      artistPop: 0,
      userId: null
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        if (response != "") {
          this.setState({
            nowPlaying: {
              name: response.item.name,
              albumArt: response.item.album.images[0].url
            }
          });
        } else {
          console.log("Failed to get current playback state.");
        }
      })
  }

  getMyPlaylists() {
      this.fetchUserFollowedPlaylists(this.state.userId).then((playlistList) => {
        this.setState({
          playlists: playlistList
        });
        console.log(playlistList);
      });
  }

  promisesForPages(promise) {
    function stripParameters(href) {
      var u = new URL(href);
      return u.origin + u.pathname;
    }

    function fetchGeneric(results, offset, limit) {
      return spotifyApi.getGeneric(
        stripParameters(results.href) + '?offset=' + offset + '&limit=' + limit
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

  fetchUserFollowedPlaylists(user) {
    return this.promisesForPages(
      promiseThrottle.add(function() {
        // fetch user's playlists, 50 at a time
        return spotifyApi.getUserPlaylists(user, { limit: 50 });
      })
    )
    .then(function(pagePromises) {
      // wait for all promises to be finished
      return Promise.all(pagePromises);
    })
    .then(function(pages) {
      // combine and filter playlists
      var userOwnedPlaylists = [];
      pages.forEach(function(page) {
        userOwnedPlaylists = userOwnedPlaylists.concat(page.items);
      });
      return userOwnedPlaylists;
    });
  }

  fetchFollowedArtists() {
    return this.promisesForPages(
      promiseThrottle.add(function() {
        return spotifyApi.getFollowedArtists({ limit: 20 });
      })
    ).then(function(pagePromises) {
      console.log(pagePromises);
      // wait for all promises to be finished
      return Promise.all(pagePromises);
    }).then(function(pages) {
      let followedArtists = [];
      pages.forEach(function(page) {
        followedArtists.push(page.artists.items);
      });
      console.log(followedArtists);
    });
  }

  render() {
    return (
      <div className="App">
        <Login loggedIn={this.state.loggedIn} token={this.state.userId}> </Login>
        <NowPlaying loggedIn={this.state.loggedIn} nowPlaying={this.state.nowPlaying} playingClick={this.getNowPlaying} />
        { this.state.loggedIn &&
          <button onClick={() => this.getMyPlaylists()}>Get Playlists</button>
        }

        { this.state.playlists && this.state.playlists.length &&
          <Playlists returnedPlaylists={this.state.playlists} />
        }

        { this.state.loggedIn &&
          <button onClick={() => this.fetchFollowedArtists()}>Get Followed Artists</button>
        }
      </div>
    );
  }
}

export default App;
