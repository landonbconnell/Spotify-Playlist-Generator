import React from 'react';

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    color: 'white',
    fontFamily: '"Helvetica Neue", Arial, sans-serif',
  },
  banner: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    marginBottom: '1em',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    fontSize: '1em',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
  },
};

const LogInPage = () => {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = () => {
    window.location.href = `${REACT_APP_API_URL}/auth/login`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.banner}>Spotify Playlist Generator</div>
      <button style={styles.loginButton} onClick={handleLogin}>
        Log in with Spotify
      </button>
    </div>
  );
};

export default LogInPage;
