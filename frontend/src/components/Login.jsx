import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/login', { email, password }, { withCredentials: true });
      setUser({ email });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la connexion');
    }
  }

  return (
   <form onSubmit={handleSubmit} className="auth-form">
  <h2>Connexion</h2>
  
  <div className="form-group">
    <label htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      className="form-control"
      value={email}
      onChange={e => setEmail(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label htmlFor="password">Mot de passe</label>
    <input
      type="password"
      id="password"
      className="form-control"
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
    />
  </div>

  <button className="btn btn-primary" type="submit">Se connecter</button>
</form>


  );
}
