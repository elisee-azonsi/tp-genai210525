import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', { email, password }, { withCredentials: true });
      setUser({ email });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de l\'inscription');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      <div className="mb-3">
        <label>Email</label>
        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Mot de passe</label>
        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <button className="btn btn-primary" type="submit">S'inscrire</button>
    </form>
  );
}
