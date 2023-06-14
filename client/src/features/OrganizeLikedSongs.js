import { React, useEffect, useState } from 'react';
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
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}
        >
            {loading 
            ? <>
                <CircularProgress color="inherit" />
                <Typography variant="h6" style={{ marginTop: '20px' }}>Getting your Tracks</Typography>
              </>
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
                            <ListItemText primary={track.name} secondary={track.artist} />
                        </ListItem>
                    ))}
                </List>
              </Box>
            }
        </Box>
    );
};

export default OrganizeLikedSongs;
