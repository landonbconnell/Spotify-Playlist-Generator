// Require the express module
const express = require('express');
const cors = require('cors');
const userRouter = require('./routers/userRouter.js');
const trackRouter = require('./routers/trackRouter.js');
const authRouter = require('./routers/authRouter.js');
const playlistRouter = require('./routers/playlistRouter.js');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

// Create a new express application
const app = express();

// The port that the server will listen on
const port = 5000;

// Start the server listening on the specified port
app.listen(port, () => {
  console.log(`Server is running on ${process.env.SERVER_URL}:${port}`);
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

app.use('/users', userRouter);
app.use('/tracks', trackRouter);
app.use('/auth', authRouter);
app.use('/playlists', playlistRouter);
