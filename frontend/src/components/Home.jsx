import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/home.css';

export default function Home() {
  const [productName, setProductName] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await axios.get('http://localhost:5000/api/history', { withCredentials: true });
      setHistory(res.data);
    } catch {
      setHistory([]);
    }
  }

  async function handleGenerate(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/generate',
        { product_name: productName },
        { withCredentials: true }
      );
      setResult(res.data.result);
      setProductName('');
      fetchHistory();
    } catch (err) {
      if (err.response?.status === 429) {
        alert("Limite de 5 requêtes par jour atteinte. Reviens demain !");
    } else {
        alert(err.response?.data?.error || 'Erreur lors de la génération');
  }
  console.log(err.response?.data?.error);
    }
  }

  return (
    <div className='home'>
        <div className="aeq">
            <form onSubmit={handleGenerate}>
                <h2>Générer une fiche produit</h2>
                <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nom du produit"
                    value={productName}
                    onChange={e => setProductName(e.target.value)}
                    required
                />
                </div>
                <button type="submit" className="btn btn-success">Générer</button>
            </form>

            {result && (
                <div className="card mt-4">
                <div className="card-body">
                    <h5>Fiche générée :</h5>
                    <p>{result}</p>
                </div>
                </div>
            )}
    </div>
      <h3 className="mt-5">Historique des requêtes</h3>
      {history.length === 0 && <p>Aucune requête.</p>}
      <ul className="list-group">
        {history.map((item, idx) => (
          <li key={idx} className="list-group-item">
            <strong>{item.product_name}</strong><br />
            <small>{new Date(item.timestamp).toLocaleString()}</small>
            <p>{item.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
