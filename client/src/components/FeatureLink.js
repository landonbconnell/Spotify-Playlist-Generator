import React from 'react';
import '../styles/FeatureLink.css';

const FeatureLink = ({ featureName, link }) => {
    return (
        <div className="spotify-feature">
            <a href={link} className="spotify-feature-link">
                {featureName}
            </a>
        </div>
    );
};

export default FeatureLink;
