import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Box, List, ListItem, ListItemText, Checkbox, FormControlLabel } from '@mui/material';

const OrganizeLikedSongs = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

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

    const handleCheck = (track) => {
        if (selectedTracks.find((selectedTrack) => selectedTrack.id === track.id)) {
            setSelectedTracks(selectedTracks.filter((selectedTrack) => selectedTrack.id !== track.id));
        } else {
            setSelectedTracks([...selectedTracks, track]);
        }
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if(!selectAll){
            setSelectedTracks(tracks);
        }else{
            setSelectedTracks([]);
        }
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            style={{ 
                minHeight: '100vh', 
                backgroundColor: '#121212', 
                color: 'white', 
                paddingLeft: '40px', 
                paddingRight: '40px'
             }}
        >
            {!loading && 
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center" // align box to center
                    justifyContent="center"
                    style={{ 
                        backgroundColor: '#1DB954', 
                        color: 'black', 
                        padding: '10px 0', 
                        borderRadius: '10px 10px 0 0',
                        position: 'fixed', // Change this from 'sticky' to 'fixed'
                        top: 0, 
                        left: '40px',
                        right: '40px',
                        zIndex: 999, // Ensure the box appears over the content
                        marginTop: '30px'
                    }} 
                >
                    <Typography variant="h3" style={{ marginBottom: '20px', marginTop:'20px', color: 'white' }}>Organize Liked Songs</Typography>
                </Box>
            }
            <Box style={{ paddingTop: !loading ? '100px' : '0' }}>
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
                      paddingLeft: '15px',
                      borderRadius: '0 0 0 10px'
                  }}>
                    <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center" 
                        mb={2} 
                        position="sticky" 
                        top={0} 
                        bgcolor="#282828" 
                        zIndex={1}
                        style={{ 
                            padding: '15px 27px 10px 15px', 
                            borderRadius: '10px 10px 0 0', 
                            backgroundColor: '#282828',
                            borderBottom: '1px solid gray',
                            marginBottom: '0px'
                        }}
                    >
                      <Typography variant="h5" style={{ color: 'white' }}>Liked Songs</Typography>
                      <FormControlLabel
                          control={<Checkbox checked={selectAll} onChange={handleSelectAll} style={{ color: 'white' }} disableRipple size="large"/>}
                          label="Select All"
                          labelPlacement="start"
                          style={{ color: 'white' }}
                      />
                  </Box>
                  <List>
                      {tracks.map(track => (
                          <ListItem key={track.id} divider>
                              <ListItemText 
                                  primary={track.name} 
                                  secondary={<Typography variant="body2" style={{ color: 'gray' }}>{track.artist}</Typography>} 
                              />
                              <Checkbox 
                                  checked={selectedTracks.includes(track)}
                                  color="default" 
                                  inputProps={{ 'aria-label': 'checkbox with default color' }} 
                                  onChange={() => handleCheck(track)}
                                  disableRipple
                                  size="large"
                                  style={{ color: 'white' }}
                              />
                          </ListItem>
                      ))}
                  </List>
                </Box>
              }
            </Box>
        </Box>
    );
};

export default OrganizeLikedSongs;
