import React from "react";
import Table from "./Table/Table";
import PropTypes from "prop-types";
import PromisePages from "../util/PagePromises";

const columns = [
  //{ key: "logo", name: "", isImage: true },
  { key: "playlistName", name: "Playlist Name", isImage: false },
  { key: "numTracks", name: "Tracks", isImage: false }
];

class Playlists extends React.Component {
  // Also might need passed in functions for handling export of playlists to containter component. This will allow this component to be self contained while still exporting selected palylists for extracting artists from them.
  static propTypes = {
    userId: PropTypes.string.isRequired,
    throttler: PropTypes.object.isRequired,
    spotifyApi: PropTypes.object.isRequired
  };

  state = {
    returnedPlaylists: null,
    selectedPlaylists: []
  };

  getIconImage = playlist => {
    if (playlist.images[2]) return playlist.images[2].url;
    else if (playlist.images[0]) return playlist.images[0].url;
    return false;
  };

  componentDidMount() {
    this.fetchUserFollowedPlaylists(this.props.userId).then(playlistList => {
      this.setState({
        returnedPlaylists: playlistList
      });
    });
  }

  fetchUserFollowedPlaylists = userId => {
    return PromisePages.concatPages(
      this.props.spotifyApi,
      this.props.throttler,
      this.props.spotifyApi.getUserPlaylists(userId, { limit: 50 })
    )
      .then(function(pagePromises) {
        return Promise.all(pagePromises);
      })
      .then(function(pages) {
        var userOwnedPlaylists = [];
        pages.forEach(function(page) {
          userOwnedPlaylists = userOwnedPlaylists.concat(page.items);
        });
        return userOwnedPlaylists;
      });
  };

  // handleMouseDown = (e, { rowIdx }) => {
  //   let index = this.state.selectedPlaylists.indexOf(rowIdx);
  //   if (index > -1) {
  //     let updatedSelected = this.state.selectedPlaylists;
  //     updatedSelected.splice(index, 1);
  //     this.setState({ selectedPlaylists: updatedSelected });
  //   } else {
  //     this.setState({
  //       selectedPlaylists: [...this.state.selectedPlaylists, rowIdx]
  //     });
  //   }
  // };

  render() {
    if (!this.state.returnedPlaylists) {
      return <p>Loading Playlists...</p>;
    } else {
      const playlistRows = this.state.returnedPlaylists.map(playlist => {
        var simplifiedPlaylist = {};
        simplifiedPlaylist.playlistName = playlist.name;
        simplifiedPlaylist.numTracks = playlist.tracks.total;
        simplifiedPlaylist.id = playlist.id;

        return simplifiedPlaylist;
      });
      return <Table columns={columns} rows={playlistRows} />;
    }
  }
}

export default Playlists;
