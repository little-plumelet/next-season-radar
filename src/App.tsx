import {
  HashRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'

import { Home } from './popup/pages/Home'
import { ShowPage } from './popup/pages/ShowPage'

function NotFound() {
  return <p>Page not found.</p>
}

function AppLayout() {
  return (
    <div className="app-layout">
      <nav className="app-nav" aria-label="Main">
        <NavLink to="/" end>
          Home
        </NavLink>
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

function App() {
  return (
    <div className="app-shell">
      <HashRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/show/:id" element={<ShowPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
