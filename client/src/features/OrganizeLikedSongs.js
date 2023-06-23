import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  IconButton,
  Button,
  Container,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Function to fetch playlist names and descriptions
const fetchPlaylistNamesAndDescriptions = (
  setPlaylistIdeas,
  currentId,
  setCurrentId
) => {
  return axios
    .get('http://localhost:5000/playlists/getNamesAndDescriptions')
    .then((response) => {
      const playlists = response.data.playlists;
      playlists.forEach((playlist) => {
        playlist.id = currentId;
        setCurrentId(currentId + 1);
      });
      setPlaylistIdeas(response.data.playlists);
    })
    .catch((error) => {
      console.log(error);
    });
};

const LoadingComponent = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '50vh' }}
  >
    <CircularProgress sx={{ color: '#1DB954' }} />
    <Typography variant="h6" style={{ marginTop: '20px' }}>
      Getting your Liked Songs
    </Typography>
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
      borderRadius: '10px',
      position: 'fixed', // Change this from 'sticky' to 'fixed'
      top: 0,
      left: '40px',
      right: '40px',
      zIndex: 999, // Ensure the box appears over the content
      marginTop: '30px',
    }}
  >
    <Typography
      variant="h3"
      style={{ marginBottom: '20px', marginTop: '20px', color: 'white' }}
    >
      Organize Liked Songs
    </Typography>
  </Box>
);

const TrackList = ({ tracks, selectedTracks, handleCheck }) => (
  <List>
    {tracks.map((track) => (
      <ListItem key={track.id} divider>
        <ListItemText
          primary={track.name}
          secondary={
            <Typography variant="body2" style={{ color: 'gray' }}>
              {track.artist}
            </Typography>
          }
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
    control={
      <Checkbox
        checked={selectAll}
        onChange={handleSelectAll}
        style={{ color: 'white' }}
        disableRipple
        size="large"
      />
    }
    label="Select All"
    labelPlacement="start"
    style={{ color: 'white' }}
  />
);

const GeneratePlaylistIdeasBox = ({
  playlistIdeas,
  setPlaylistIdeas,
  onDelete,
  currentId,
  setCurrentId,
}) => {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGeneratePlaylistNames = () => {
    setLoading(true);
    fetchPlaylistNamesAndDescriptions(
      setPlaylistIdeas,
      currentId,
      setCurrentId
    ).finally(() => setLoading(false));
  };

  const handleGeneratePlaylistByKeywords = () => {
    setLoading(true);
    axios
      .get(
        `http://localhost:5000/playlists/getNameAndDescriptionByKeyword/${keywords}`
      )
      .then((response) => {
        const newPlaylist = response.data;
        newPlaylist.id = currentId;
        setCurrentId(currentId + 1);
        setPlaylistIdeas([...playlistIdeas, newPlaylist]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    setKeywords('');
  };

  return (
    <Container
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      maxWidth="sm"
      sx={{
        maxHeight: '80vh',
        bgcolor: '#282828',
        p: 2,
        borderRadius: '10px',
        m: '0 auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} sx={{ borderBottom: '1px solid gray', pb: 2 }}>
          <Typography variant="h5" sx={{ color: 'white', pt: 1, pl: 2 }}>
            Playlist Idea Generation
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          style={{
            maxHeight: '600px',
            overflowY: 'auto',
            width: '100%',
            pt: 2,
          }}
        >
          {playlistIdeas.length === 0 && loading && (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              style={{ minHeight: '100%' }}
            >
              <CircularProgress sx={{ color: '#1DB954' }} />
              <Typography variant="h6" style={{ marginTop: '20px' }}>
                Generating Playlist Ideas...
              </Typography>
              <Typography variant="p">This may take a minute</Typography>
            </Grid>
          )}

          {playlistIdeas.length === 0 && !loading && (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '10px', backgroundColor: '#1DB954' }}
                onClick={handleGeneratePlaylistNames}
                disabled={loading}
              >
                Generate Playlist Ideas
              </Button>
            </Grid>
          )}

          {playlistIdeas.map((playlist) => (
            <PlaylistNameAndDescription
              key={playlist.id}
              playlistName={playlist.playlist_name}
              playlistDescription={playlist.playlist_description}
              onDelete={() => onDelete(playlist.id)}
            />
          ))}
        </Grid>

        {playlistIdeas.length !== 0 && (
          <Grid
            item
            xs={12}
            sx={{
              mt: 1,
              position: 'sticky',
              bottom: 0,
              bgcolor: '#282828',
              p: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="keyword(s)"
              style={{
                marginRight: '10px',
                width: '300px',
                height: '36px',
                borderRadius: '5px',
              }}
            />

            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: '#1DB954', marginRight: '10px' }}
              onClick={handleGeneratePlaylistByKeywords}
              disabled={loading}
            >
              <AddIcon />
            </Button>

            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: '#1DB954' }}
              onClick={() => {
                setPlaylistIdeas([]);
                setLoading(true);
                handleGeneratePlaylistNames();
              }}
            >
              <RefreshIcon />
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

const PlaylistNameAndDescription = ({
  playlistName,
  playlistDescription,
  onDelete,
}) => {
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
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'white',
        }}
      >
        <CloseIcon />
      </IconButton>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          color: 'white',
          fontSize: '1.25rem',
          width: '100%',
          marginBottom: '10px',
          backgroundColor: 'transparent',
          border: 'none',
        }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{
          color: 'white',
          fontSize: '1rem',
          width: '100%',
          backgroundColor: 'transparent',
          border: 'none',
          resize: 'vertical',
        }}
      />
    </Box>
  );
};

const PlaylistBox = ({
  selectedTracks,
  playlistIdeas,
  currentId,
  setCurrentId,
}) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leftoverTracks, setLeftoverTracks] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleClick = () => {
    setLoading(true);

    let url = 'http://localhost:5000/playlists/generatePlaylists';
    let payloads = [];

    const tracksPerAPICall = 10;
    const numAPICalls = Math.ceil(selectedTracks.length / tracksPerAPICall);

    for (let i = 0; i < numAPICalls; i++) {
      payloads.concat({
        playlists: playlistIdeas,
        tracks: selectedTracks.slice(
          tracksPerAPICall * i,
          tracksPerAPICall * (i + 1)
        ),
      });
    }

    let promises = payloads.map((payload) =>
      axios.post(url, JSON.stringify(payload))
    );

    Promise.allSettled(promises).then((results) =>
      results.forEach((result) => console.log(result.status))
    );
  };

  const mergePlaylists = (playlists, sortedTracks) => {
    return playlists.map((playlist) => {
      let sorted = sortedTracks.find(
        (sortedTrack) => sortedTrack.playlist_name === playlist.playlist_name
      );
      if (sorted) {
        return {
          ...playlist,
          tracks: [...playlist.tracks, ...sorted.tracks],
        };
      }
      return playlist;
    });
  };

  // const handleClick = async () => {
  //   setLoading(true);

  //   const tracksPerAPICall = 10;
  //   const numAPICalls = Math.ceil(selectedTracks.length / tracksPerAPICall);
  //   let i;

  //   for (i = 0; i < numAPICalls; i++) {
  //     let input = {
  //       playlists: playlistIdeas,
  //       tracks: selectedTracks.slice(
  //         tracksPerAPICall * i,
  //         tracksPerAPICall * (i + 1)
  //       ),
  //     };

  //     await axios
  //       .post('http://localhost:5000/playlists/generatePlaylists', input)
  //       .then((response) => {
  //         let sortedTracks = response.data.playlists;
  //         if (playlists.length === 0) {
  //           setPlaylists(sortedTracks);
  //         } else {
  //           let updatedPlaylists = mergePlaylists(playlists, sortedTracks);
  //           setPlaylists(updatedPlaylists);
  //         }

  //         console.log(playlists);
  //       })
  //       .catch((error) => console.log(error));
  //   }

  //   setLoading(false);
  // };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      style={{
        maxHeight: '80vh',
        overflow: 'auto',
        width: '100%',
        maxWidth: '800px', // increased max-width
        backgroundColor: '#282828',
        paddingLeft: '15px',
        borderRadius: '10px',
      }}
    >
      <Typography
        variant="h5"
        style={{
          color: 'white',
          padding: '15px 0',
          borderBottom: '1px solid gray',
        }}
      >
        Playlists
      </Typography>

      {!loading && playlists.length === 0 && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ height: '100%' }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: '10px', backgroundColor: '#1DB954' }}
            onClick={handleClick}
            disabled={playlistIdeas.length === 0 || selectedTracks.length === 0}
          >
            Generate Playlists
          </Button>
        </Grid>
      )}

      {playlists.map((playlist, index) => (
        <Playlist key={index} playlist={playlist} tracks={playlist.tracks} />
      ))}
    </Box>
  );
};

const Playlist = ({ playlist, tracks }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState(tracks);
  const [numTracksDisplayed, setNumTracksDisplayed] = useState(3);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    playlist.tracks.length !== 0 && (
      <Grid container direction="column" justifyContent="flex-start">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography
              variant="h6"
              style={{ color: 'white', padding: '10px 0' }}
            >
              {playlist.playlist_name}
            </Typography>
          </Grid>

          <Grid item>
            {expanded ? (
              <IconButton
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{
                  padding: '15px',
                  color: 'white',
                }}
              >
                <ExpandLessIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                style={{
                  padding: '15px',
                  color: 'white',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>

        {expanded && (
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            style={{ padding: '0px' }}
          >
            <TrackList
              tracks={tracks.slice(0, numTracksDisplayed)}
              selectedTracks={selectedTracks}
              handleCheck={() => {}}
            />

            {tracks.length > numTracksDisplayed && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '10px', backgroundColor: '#1DB954' }}
                onClick={() => setNumTracksDisplayed(numTracksDisplayed + 3)}
              >
                See More
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    )
  );
};

// Main Component
const OrganizeLikedSongs = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [playlistIdeas, setPlaylistIdeas] = useState([]);
  const [currentId, setCurrentId] = useState(0);

  // Fetch tracks function
  useEffect(() => {
    axios
      .get('http://localhost:5000/tracks/saved')
      .then((response) => {
        setTracks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectAll) {
      setSelectedTracks(tracks);
    }
  }, [tracks]);

  useEffect(() => {
    selectAll ? setSelectedTracks(tracks) : setSelectedTracks([]);
  }, [setSelectedTracks, tracks]);

  const handleCheck = useCallback(
    (track) => {
      if (
        selectedTracks.find((selectedTrack) => selectedTrack.id === track.id)
      ) {
        setSelectedTracks(
          selectedTracks.filter(
            (selectedTrack) => selectedTrack.id !== track.id
          )
        );
      } else {
        setSelectedTracks([...selectedTracks, track]);
      }
    },
    [selectedTracks]
  );

  const handleSelectAll = useCallback(() => {
    setSelectAll(!selectAll);
  }, [selectAll]);

  const handleDeletePlaylist = useCallback(
    (id) => {
      setPlaylistIdeas(playlistIdeas.filter((playlist) => playlist.id !== id));
    },
    [playlistIdeas]
  );

  const handleGeneratePlaylistNames = useCallback(() => {
    setLoading(true);
    fetchPlaylistNamesAndDescriptions(setPlaylistIdeas).finally(() =>
      setLoading(false)
    );
  }, []);

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
        paddingRight: '40px',
      }}
    >
      {!loading && <OrganizeLikedSongsHeader />}
      <Box style={{ paddingTop: !loading ? '100px' : '0' }}>
        {loading ? (
          <LoadingComponent />
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box
              style={{
                maxHeight: '80vh',
                overflow: 'auto',
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#282828',
                paddingLeft: '15px',
                borderRadius: '10px',
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
                  //borderRadius: '10px',
                  backgroundColor: '#282828',
                  borderBottom: '1px solid gray',
                  marginBottom: '0px',
                }}
              >
                <Typography variant="h5" style={{ color: 'white' }}>
                  Liked Songs
                </Typography>
                <SelectAll
                  selectAll={selectAll}
                  handleSelectAll={handleSelectAll}
                />
              </Box>
              <TrackList
                tracks={tracks}
                selectedTracks={selectedTracks}
                handleCheck={handleCheck}
              />
            </Box>
            <GeneratePlaylistIdeasBox
              playlistIdeas={playlistIdeas}
              setPlaylistIdeas={setPlaylistIdeas}
              onDelete={handleDeletePlaylist}
              currentId={currentId}
              setCurrentId={setCurrentId}
            />
            <PlaylistBox
              selectedTracks={selectedTracks}
              playlistIdeas={playlistIdeas}
              currentId={currentId}
              setCurrentId={setCurrentId}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OrganizeLikedSongs;
