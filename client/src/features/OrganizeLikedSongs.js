import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Box, List, ListItem, ListItemText, Checkbox, FormControlLabel, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';

const FetchTracks = (setTracks, setLoading) => {
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
}

// Function to fetch playlist names and descriptions
const fetchPlaylistNamesAndDescriptions = (setPlaylists) => {
    return axios.get('http://localhost:5000/playlists/getNamesAndDescriptions')
        .then(response => {
            setPlaylists(response.data);
        })
        .catch(error => {
            console.log(error);
        });
}


const LoadingComponent = () => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#1DB954' }} />
        <Typography variant="h6" style={{ marginTop: '20px' }}>Getting your Liked Songs</Typography>
    </Box>
);

const OrganizeLikedSongsHeader = () => (
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
);

const TrackList = ({ tracks, selectedTracks, handleCheck }) => (
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
);

const SelectAll = ({ selectAll, handleSelectAll }) => (
    <FormControlLabel
        control={<Checkbox checked={selectAll} onChange={handleSelectAll} style={{ color: 'white' }} disableRipple size="large"/>}
        label="Select All"
        labelPlacement="start"
        style={{ color: 'white' }}
    />
);

const GeneratePlaylistBox = ({ playlists, setPlaylists, onDelete }) => {
    const [keywords, setKeywords] = useState('');
    const [loading, setLoading] = useState(false);

    console.log(playlists)

    const handleGeneratePlaylistNames = () => {
        setLoading(true); // Start loading
        fetchPlaylistNamesAndDescriptions(setPlaylists).finally(() => setLoading(false)); // End loading after fetching
    }

    return (
    
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="start"
        alignItems="start"
        style={{
            maxHeight: '80vh',
            overflow: 'auto',
            width: '100%',
            maxWidth: '800px',
            backgroundColor: '#282828',
            padding: '15px 15px 15px 15px',
            borderRadius: '0 10px 0 10px',
            marginLeft: '60px',
            marginRight: '60px'
        }}
    >
        <Box style={{ width: '100%', borderBottom: '1px solid gray', paddingBottom: '20px' }}>
            <Typography variant="h5" style={{ color: 'white', padding: '10px 0 0 15px' }}>Playlist Idea Generation</Typography>
        </Box>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center" // center items along the main axis
            style={{
                overflow: 'auto',
                flex: '1 1 auto',
                width: '100%',
                paddingTop: '15px'
            }}
        >
            { (playlists.length === 0 && loading) &&
                <>
                    <CircularProgress sx={{ color: '#1DB954' }} />
                    <Typography variant="h6" style={{ marginTop: '20px' }}>Generating Playlist Ideas...</Typography>
                    <Typography variant="p">This may take a minute</Typography>
                </>
            }  

            { (playlists.length === 0 && !loading) &&
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '10px', backgroundColor: '#1DB954' }} // Add some spacing
                    onClick={handleGeneratePlaylistNames}
                    disabled={loading} // disable the button when loading
                >
                    Generate Playlist Ideas
                </Button>
            }

            {playlists.map((playlist) => (
                <PlaylistNameAndDescription 
                    key={playlist.id}
                    playlistName={playlist.name} 
                    playlistDescription={playlist.description} 
                    onDelete={() => onDelete(playlist.id)}
                />
            ))}
        </Box>

        {playlists.length !== 0 &&
            <Box 
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                style={{ marginTop: '10px', position: 'sticky', bottom: 0, background: '#282828', padding: '20px' }} 
            >
                <input 
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="keyword(s)"
                    style={{ marginRight: '10px', width: '300px', height: '100%', borderRadius: '5px' }} // Add some spacing
                />

                <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: '#1DB954', marginRight: '10px' }}
                    onClick={() => { /* Handle add keyword function here */ }}
                >
                    <AddIcon />
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: '#1DB954' }}
                    onClick={() => { /* Handle redo function here */ }}
                >
                    <RefreshIcon />
                </Button>
            </Box>
        }
        </Box>
    )
}



const PlaylistBox = () => (
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        style={{
            maxHeight: '80vh',
            overflow: 'auto',
            width: '100%',
            maxWidth: '800px', // increased max-width
            backgroundColor: '#282828',
            paddingLeft: '15px',
            borderRadius: '0 0 0 10px'
        }}
    >
        <Typography variant="h5" style={{ color: 'white', padding: '15px 0', borderBottom: '1px solid gray' }}>Playlists</Typography>
    </Box>
);

const PlaylistNameAndDescription = ({ playlistName, playlistDescription, onDelete }) => {
    const [name, setName] = useState(playlistName);
    const [description, setDescription] = useState(playlistDescription);
  
    useEffect(() => {
        setName(playlistName);
        setDescription(playlistDescription);
    }, [playlistName, playlistDescription]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            position="relative"
            padding="15px"
            margin="0 0 15px 0"
            bgcolor="#3f3f3f"
            borderRadius="5px"
            width="100%"
        >
            <IconButton
                aria-label="delete"
                onClick={onDelete}
                style={{ position: 'absolute', top: '10px', right: '10px', color: 'white' }}
            >
                <CloseIcon />
            </IconButton>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ color: 'white', fontSize: '1.25rem', width: '100%', marginBottom: '10px', backgroundColor: 'transparent', border: 'none' }}
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ color: 'white', fontSize: '1rem', width: '100%', backgroundColor: 'transparent', border: 'none' }}
            />
        </Box>
    );
};



// Main Component
const OrganizeLikedSongs = () => {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTracks, setSelectedTracks] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [playlists, setPlaylists] = useState([]);

    FetchTracks(setTracks, setLoading);

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

    const handleDeletePlaylist = (id) => {
        setPlaylists(playlists.filter((playlist) => playlist.id !== id));
    };    

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
                <OrganizeLikedSongsHeader />
            }
            <Box style={{ paddingTop: !loading ? '100px' : '0' }}>
              {loading 
              ? <LoadingComponent />
              : <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Box
                      style={{
                          maxHeight: '80vh',
                          overflow: 'auto',
                          width: '100%',
                          maxWidth: '600px',
                          backgroundColor: '#282828',
                          paddingLeft: '15px',
                          borderRadius: '0 0 0 10px'
                      }}
                  >
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
                      <SelectAll selectAll={selectAll} handleSelectAll={handleSelectAll} />
                    </Box>
                    <TrackList tracks={tracks} selectedTracks={selectedTracks} handleCheck={handleCheck} />
                  </Box>
                  <GeneratePlaylistBox playlists={playlists} setPlaylists={setPlaylists} onDelete={handleDeletePlaylist} />
                  <PlaylistBox />
                </Box>
              }
            </Box>
        </Box>
    );
};

export default OrganizeLikedSongs;