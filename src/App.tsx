import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'

import { Home } from './popup/pages/Home'

function TrackedShows() {
  return (
    <div>
      <h1>Tracked shows</h1>
      <p>Your list will live here.</p>
    </div>
  )
}

function NotFound() {
  return <p>Page not found.</p>
}

function App() {
  return (
    <HashRouter>
      <nav className="app-nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/tracked-shows">Tracked shows</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracked-shows" element={<TrackedShows />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
