import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';

function App() {
  const [page, setPage] = useState('home'); // home, test, loading, result
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Keep-alive heartbeat
  useEffect(() => {
    const pingBackend = () => {
      axios.get(import.meta.env.VITE_API_URL + '/ping')
        .then(() => console.log('Backend pinged to keep alive'))
        .catch(err => console.error('Ping failed', err));
    };

    // Ping immediately on load
    pingBackend();

    // Ping every 5 minutes (300,000 ms)
    const interval = setInterval(pingBackend, 300000);

    return () => clearInterval(interval);
  }, []);

  const startTest = () => {
    setPage('test');
    setError('');
  };

  const submitAnswers = async (answers) => {
    setPage('loading');
    try {
      // Local dev URL, in prod this should be relative or env var
      const response = await axios.post(
        import.meta.env.VITE_API_URL + '/api/analyze-stress',
        { answers }
      );

      setResult(response.data);
      setPage('result');
    } catch (err) {
      console.error(err);
      setError('Failed to analyze results. Please try again.');
      setPage('home'); // or keep in test?
      // For demo robustness, if API fails, fallback to basic mock calculation?
      // Let's stick to error message for now, or fallback.
      // Fallback:
      /*
      const score = Object.values(answers).reduce((a, b) => a + b, 0) / Object.keys(answers).length;
      setResult({ score, tips: ["Could not connect to AI. Check your connection."] });
      setPage('result');
      */
    }
  };

  const retakeTest = () => {
    setResult(null);
    setPage('home');
  };

  return (
    <div className="App">
      {/* Header/Nav could go here */}

      {page === 'home' && <Home onStart={startTest} />}

      {page === 'test' && <Questionnaire onSubmit={submitAnswers} onCancel={retakeTest} />}

      {page === 'loading' && (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loader" style={{
            width: '50px', height: '50px',
            border: '5px solid #e2e8f0', borderTopColor: 'var(--primary)',
            borderRadius: '50%', animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Analyzing your responses...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {page === 'result' && result && (
        <Results result={result} onRetake={retakeTest} />
      )}

      {error && (
        <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--error)', color: 'white', padding: '10px 20px', borderRadius: '8px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
