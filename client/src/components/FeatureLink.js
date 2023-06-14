import { React, useEffect } from 'react';
import axios from 'axios'
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
