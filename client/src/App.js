import React from 'react'
import { Routes, Route } from 'react-router-dom'

import LogInPage from "./pages/LogInPage"
import HomePage from "./pages/HomePage"
import CreatePlaylist from './features/CreatePlaylist'
import ModifyPlaylist from './features/ModifyPlaylist'
import OrganizeLikedSongs from './features/OrganizeLikedSongs'

const App = () => (
    <Routes>
      <Route path='/' element={<LogInPage />}/>
      <Route path='/home' element={<HomePage />}/>
      <Route path='/create_playlist' element={<CreatePlaylist />}/>
      <Route path='/modify_playlist' element={<ModifyPlaylist />}/>
      <Route path='/organize_liked_songs' element={<OrganizeLikedSongs />}/>
    </Routes>
)


export default App;
