import React from 'react';
import '../styles/HomePage.css'
import FeatureLink from '../components/FeatureLink';
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <div className="spotify-app">
            <header className="spotify-header">
                <h1>Spotify Playlist Generator</h1>
            </header>
            <main className="spotify-main">
                <section className="spotify-section">
                    <h2>Features</h2>
                    <div className="spotify-window">
                        <Link to="/create_playlist">
                            <FeatureLink featureName="Create New Playlist" />
                        </Link>
                        <Link to="/modify_playlist">
                            <FeatureLink featureName="Modify Existing Playlist" />
                        </Link>
                        <Link to="organize_liked_songs">
                            <FeatureLink featureName="Organize Liked Songs" />
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;