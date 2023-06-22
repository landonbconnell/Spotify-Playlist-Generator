import { React, useEffect } from 'react';
import axios from 'axios';
import '../styles/HomePage.css';
import FeatureLink from '../components/FeatureLink';
import { Link, useLocation } from 'react-router-dom';

const HomePage = () => {
  /* gets the authorization code from the URL*/
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code');

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (code) {
      axios
        .get(`http://localhost:5000/auth/getAccessToken/${code}`, {
          cancelToken: source.token,
        })
        .then(() => console.log('success'))
        .catch((err) => {
          if (axios.isCancel(err)) {
            console.log('Request canceled', err.message);
          } else {
            console.log(err);
          }
        });
    }
    // Cleanup function to cancel ongoing Axios request if component unmounts
    return () => {
      source.cancel('Operation canceled by the user.');
    };
  }, [code]);

  return (
    <div className="spotify-app">
      <header className="spotify-header">
        <h1>Spotify Playlist Generator</h1>
      </header>
      <main className="spotify-main">
        <section className="spotify-section">
          <h2>Features</h2>
          <div className="spotify-window">
            <Link to="organize_liked_songs">
              <FeatureLink featureName="Organize Liked Songs" code={code} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
