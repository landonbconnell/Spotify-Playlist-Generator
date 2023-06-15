import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const OrganizeLikedSongs = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/tracks/saved')
            .then(response => {
                setTracks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            })
    }, []) // only run this hook once, when the component first loads

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            style={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white', paddingLeft: '40px', paddingRight: '40px' }}
        >
            {!loading && 
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center" // align box to center
                justifyContent="center"
                style={{ backgroundColor: '#1DB954', color: 'black', padding: '10px 0', borderRadius: '10px 10px 0 0' }} // Green banner for the title with rounded top left and right corners
            >
                <Typography variant="h3" style={{ marginBottom: '20px', marginTop:'20px', color: 'white' }}>Organize Liked Songs</Typography>
            </Box>}
            {loading 
            ? <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '50vh' }}>
                <CircularProgress sx={{ color: '#1DB954' }} />
                <Typography variant="h6" style={{ marginTop: '20px' }}>Getting your Liked Songs</Typography>
              </Box>
            : <Box
                style={{
                    maxHeight: '80vh',
                    overflow: 'auto',
                    width: '100%',
                    maxWidth: '600px',
                    backgroundColor: '#282828',
                    padding: '20px',
                    borderRadius: '10px'
                }}>
                <List>
                    {tracks.map(track => (
                        <ListItem key={track.id} divider>
                            <ListItemText 
                                primary={track.name} 
                                secondary={<Typography variant="body2" style={{ color: 'gray' }}>{track.artist}</Typography>} />
                        </ListItem>
                    ))}
                </List>
              </Box>
            }
        </Box>
    );
};

export default OrganizeLikedSongs;
