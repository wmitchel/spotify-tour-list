import React from 'react';
import Table from './Table/Table';

const columns = [
    { key: 'logo', name: '', isImage: true},
    { key: 'playlistName', name: 'Playlist Name', isImage: false},
    { key: 'numTracks', name: 'Tracks', isImage: false},
];

class Playlists extends React.Component {
    getIconImage = (playlist) => {
        if (playlist.images[2])
            return playlist.images[2].url;
        else if (playlist.images[0])
            return playlist.images[0].url;
        return false;
    }

    render() {
        const playlistRows = this.props.returnedPlaylists.map((playlist) => {
            var simplifiedPlaylist = {};
            simplifiedPlaylist.playlistName = playlist.name;
            simplifiedPlaylist.numTracks = playlist.tracks.total;
            simplifiedPlaylist.logo = this.getIconImage(playlist) || '';

            return simplifiedPlaylist;
        });
        return (
            <Table columns={columns} rows={playlistRows} />
        );
    }
}

export default Playlists;