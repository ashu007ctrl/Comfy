import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';
import Results from '../components/Results';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedHistory, setSelectedHistory] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'https://comfy-o2ia.onrender.com';

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/trends`);
                setTrends(data.data);
            } catch (err) {
                console.error("Failed to fetch trends", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTrends();
        }
    }, [user, API_URL]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '80px' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid var(--primary)', borderRadius: '50%' }}
                />
            </div>
        );
    }

    if (selectedHistory) {
        return (
            <>
                <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 2rem 0' }}>
                        <button
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                            onClick={() => setSelectedHistory(null)}
                        >
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>
                    </div>
                    <Results result={selectedHistory} onRetake={() => { setSelectedHistory(null); navigate('/assessment') }} />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="dashboard-wrapper">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="dashboard-container"
                >
                    {/* Header */}
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">
                                Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name.split(' ')[0]}</span>
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                                Track your wellness journey and AI insights.
                            </p>
                        </div>

                        <Link
                            to="/assessment"
                            className="btn btn-primary dashboard-action-btn"
                            style={{
                                borderRadius: 'var(--radius-pill)',
                                padding: '14px 28px',
                                fontWeight: '600',
                                boxShadow: '0 8px 20px rgba(167, 139, 250, 0.4)'
                            }}
                        >
                            + Take Assessment
                        </Link>
                    </div>

                    {/* Grid */}
                    <div className="dashboard-grid">
                        {/* Overall Stress Level Card */}
                        <div className="card dashboard-card">
                            <div className="card-header">
                                <h3 className="card-title">Overall Stress Level</h3>
                                <span className="card-badge">7-Day Avg</span>
                            </div>

                            <div className="score-display">
                                <span className="score-value">
                                    {trends?.last7DaysAvg ?? '--'}
                                </span>
                                <span className="score-max">/ 100</span>
                            </div>

                            <p className="card-description">
                                {trends?.dominantCluster ? `Dominant stress factor: ${trends.dominantCluster}.` : 'Complete more assessments to generate insights.'}
                            </p>

                            <div className="progress-container">
                                <div className="progress-track">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${trends?.last7DaysAvg || 0}%` }}
                                        transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                                        className="progress-fill"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Card */}
                        <div className="card dashboard-card">
                            <div className="card-header">
                                <h3 className="card-title">Recent Assessments</h3>
                            </div>

                            {trends?.history?.length > 0 ? (
                                <div className="history-list">
                                    {trends.history.slice(0, 4).map((session, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="history-item"
                                            onClick={() => setSelectedHistory(session)}
                                            style={{ cursor: 'pointer' }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="history-date">
                                                {new Date(session.date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>

                                            <div className="history-score">
                                                Score: <span>{session.score}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>No assessments taken yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;