import React from 'react';

function Login(props) {
    if (props.loggedIn)
        return <button><a href="http://localhost:8888/login">Refresh Token</a></button>;
    return <a href="http://localhost:8888/login">Login to Spotify</a>;
}

export default Login;