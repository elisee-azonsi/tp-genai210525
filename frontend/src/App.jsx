import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';


export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
  <Router>
    <nav className="navbar navbar-expand custom-navbar">
      <Link className="navbar-brand me-auto" to="/">AI Product App </Link>
      <div className="navbar-links">
        {user ? (
          <a
            className="btn btn-danger"
            onClick={async () => {
              await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
              setUser(null);
            }}
            style={{ cursor: 'pointer' }}
          >
            Déconnexion
          </a>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/login" className="btn btn-outline-primary me-2">Connexion</Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="btn btn-outline-secondary">Inscription</Link>
            </li>
          </>
        )}
      </div>
    </nav>

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
