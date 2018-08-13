import React from 'react';

class Playlists extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const listItems = this.props.returnedPlaylists.map((playlist) =>
            <li>{playlist.name}</li>
        );
        return (
            <div>
                <ul>{listItems}</ul>
            </div>
        );
    }
}

export default Playlists;