import React from 'react';

class NowPlaying extends React.Component {
    constructor(props) {
        super(props);
        this.playingClick = this.props.playingClick.bind(this);
    }

    render() {
        return (
            <div>
                { this.props.nowPlaying &&
                    <div>
                        <div>
                            Now Playing: {this.props.nowPlaying.name} <br/> Artist Popularity: {this.props.artistPop}
                        </div>
                        <div>
                            <img src={this.props.nowPlaying.albumArt} style={{ height: 150 }} />
                        </div>
                    </div>
                }
                {
                    this.props.loggedIn &&
                    <button onClick={this.props.playingClick}>
                        Check Now Playing
                    </button>
                }
            </div>
        )
    }
}

export default NowPlaying;