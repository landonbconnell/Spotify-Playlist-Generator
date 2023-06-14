import { React, useEffect } from 'react';
import '../styles/FeatureLink.css';

const FeatureLink = ({ featureName, code }) => {

    useEffect(() => {
        
    }, [])

    return (
        <div className="spotify-feature">
            <div className="spotify-feature-link">
                {featureName}
            </div>
        </div>
    );
};

export default FeatureLink;
