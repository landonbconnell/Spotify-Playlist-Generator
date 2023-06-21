#!/bin/bash
cd client
npm start &
cd ..
cd server
node app.js
