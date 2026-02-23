import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, AlertCircle, ChevronLeft, ArrowLeft } from 'lucide-react';
import Results from './Results';

const History = ({ onBack }) => {
    const [history, setHistory] = useState([]);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || 'https://comfy-o2ia.onrender.com';

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/history`);
            setHistory(response.data);
        } catch (err) {
            console.error("Failed to fetch history:", err);
            setError('Failed to load history.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader"></div>
            </div>
        );
    }

    if (selectedHistory) {
        return (
            <div style={{ paddingBottom: '40px' }}>
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '80px', paddingBottom: '1rem' }}>
                    <button
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', marginLeft: '2rem' }}
                        onClick={() => setSelectedHistory(null)}
                    >
                        <ArrowLeft size={18} /> Back to History List
                    </button>
                </div>
                <Results result={selectedHistory} onRetake={() => { setSelectedHistory(null); onBack(); }} />
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <button onClick={onBack} className="btn btn-outline" style={{ marginRight: '1rem', padding: '8px' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Assessment History</h1>
                </div>

                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

                {history.length === 0 && !error ? (
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No assessments found yet.</p>
                        <button onClick={onBack} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Take Your First Test
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {history.map((item) => (
                            <motion.div
                                key={item._id}
                                className="card hover-scale"
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedHistory({ ...item, disclaimer: "This is a past assessment from your history." })}
                                style={{ cursor: 'pointer' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        background: item.level === 'High' ? 'rgba(239, 68, 68, 0.2)' : item.level === 'Moderate' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: item.level === 'High' ? '#fca5a5' : item.level === 'Moderate' ? '#fcd34d' : '#6ee7b7'
                                    }}>
                                        {item.level} Stress
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <Calendar size={14} style={{ marginRight: '4px' }} />
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                                    Score: {item.score}/100
                                </h3>

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                                    {item.analysis?.summary || "No summary available."}
                                </p>

                                <div style={{ borderTop: 'var(--glass-border)', paddingTop: '1rem', marginTop: 'auto' }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem' }}>Top Stressor:</p>
                                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>
                                        <AlertCircle size={16} style={{ marginRight: '6px', color: 'var(--warning)' }} />
                                        {item.analysis?.keyStressors?.[0] || "General Stress"}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default History;
