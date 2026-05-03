import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wind, Zap, TrendingUp, Calendar, Star, ChevronRight } from 'lucide-react';
import Footer from '../components/Footer';
import Results from '../components/Results';
import BreathingTool from '../components/BreathingTool';
import './Dashboard.css';

// ── Daily Wellness Tips (rotates by day-of-year) ──
const DAILY_TIPS = [
    { emoji: '🌅', tip: 'Start your morning without your phone. 5 minutes of silence before screen time sets a calmer tone for the day.' },
    { emoji: '💧', tip: 'Drink a full glass of water before your morning coffee. Hydration within 30 minutes of waking sharpens focus.' },
    { emoji: '🚶', tip: 'A 10-minute walk after lunch reduces post-meal fatigue and improves afternoon concentration by up to 20%.' },
    { emoji: '📵', tip: 'Set your phone to silent for 90-minute work blocks. Uninterrupted focus sessions prevent cognitive overload.' },
    { emoji: '🌿', tip: 'Add one green thing to your next meal — even a handful of spinach counts. Small nutrition wins build momentum.' },
    { emoji: '😴', tip: 'Try going to bed 15 minutes earlier tonight. Even marginal sleep gains improve mood and stress resilience.' },
    { emoji: '✍️', tip: 'Write 3 things you are grateful for before sleeping. Gratitude journaling reduces cortisol levels overnight.' },
    { emoji: '📅', tip: 'Pick your top 3 tasks for tomorrow tonight. Clarity before bed prevents "Sunday scaries" from your tomorrow-self.' },
    { emoji: '🎵', tip: 'Listen to lo-fi or nature sounds during deep work. Consistent audio cues train your brain into focus mode.' },
    { emoji: '🧘', tip: 'Take 3 slow, deep breaths before entering any stressful meeting or situation. It activates your calm response.' },
    { emoji: '📱', tip: 'Check your phone notifications only at 3 fixed times today. This single habit reduces daily anxiety significantly.' },
    { emoji: '🏃', tip: 'Even 7 minutes of movement counts. A short workout releases endorphins that last 2–4 hours afterward.' },
    { emoji: '🌙', tip: 'Dim your lights 30 minutes before bed. Bright light suppresses melatonin — your natural sleep hormone.' },
    { emoji: '🧠', tip: 'When anxious, name what you feel out loud. "I feel anxious." Research shows labeling emotions reduces their intensity.' },
];

const getDailyTip = () => {
    const day = Math.floor(Date.now() / 86400000); // days since epoch
    return DAILY_TIPS[day % DAILY_TIPS.length];
};

// ── Motivational quotes (rotates daily) ──
const QUOTES = [
    { text: "You don't have to be perfect to be great.", author: "Unknown" },
    { text: "Rest is not giving up. Rest is getting ready.", author: "Marianne Williamson" },
    { text: "An ounce of prevention is worth a pound of cure.", author: "Benjamin Franklin" },
    { text: "Almost everything will work again if you unplug it for a while, including you.", author: "Anne Lamott" },
    { text: "Caring for myself is not self-indulgence, it is self-preservation.", author: "Audre Lorde" },
    { text: "You can't pour from an empty cup. Take care of yourself first.", author: "Unknown" },
    { text: "Mental health is not a destination, but a process.", author: "Noam Shpancer" },
];

const getDailyQuote = () => {
    const day = Math.floor(Date.now() / 86400000);
    return QUOTES[day % QUOTES.length];
};

const CLUSTER_COLORS = {
    'Work/Academic Pressure': '#a78bfa',
    'Emotional Well-being': '#f472b6',
    'Physical & Sleep Health': '#38bdf8',
    'Social & Lifestyle Balance': '#fbbf24',
    'Lifestyle & Habits': '#34d399',
};

const CLUSTER_EMOJIS = {
    'Work/Academic Pressure': '💼',
    'Emotional Well-being': '💙',
    'Physical & Sleep Health': '🌙',
    'Social & Lifestyle Balance': '🤝',
    'Lifestyle & Habits': '🌿',
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedHistory, setSelectedHistory] = useState(null);
    const [showBreathing, setShowBreathing] = useState(false);

    const dailyTip = getDailyTip();
    const dailyQuote = getDailyQuote();

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
        if (user) fetchTrends();
    }, [user, API_URL]);

    // Calculate streak from history
    const calculateStreak = (history = []) => {
        if (!history.length) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streak = 0;
        let checkDate = new Date(today);
        const sortedDates = history
            .map(h => { const d = new Date(h.date); d.setHours(0,0,0,0); return d.getTime(); })
            .sort((a, b) => b - a);
        const uniqueDates = [...new Set(sortedDates)];
        for (let i = 0; i < uniqueDates.length; i++) {
            if (uniqueDates[i] === checkDate.getTime()) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    };

    const streak = calculateStreak(trends?.history);
    const lastAssessment = trends?.history?.[0];
    const lastClusterScores = lastAssessment?.clusterScores || {};

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ width: 42, height: 42, border: '3px solid rgba(167,139,250,0.15)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
                />
            </div>
        );
    }

    if (selectedHistory) {
        return (
            <>
                <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 2rem 0' }}>
                        <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }} onClick={() => setSelectedHistory(null)}>
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>
                    </div>
                    <Results result={selectedHistory} onRetake={() => { setSelectedHistory(null); navigate('/assessment'); }} />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="db-wrapper">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="db-container"
                >
                    {/* ── Header ── */}
                    <div className="db-header">
                        <div>
                            <h1 className="db-title">
                                Welcome back, <span className="db-name">{user?.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="db-subtitle">Your personal wellness command centre</p>
                        </div>
                        <Link to="/assessment" className="db-cta-btn">
                            <Zap size={16} /> New Assessment
                        </Link>
                    </div>

                    {/* ── Top Stats Row ── */}
                    <div className="db-stats-row">
                        {/* Streak */}
                        <motion.div className="db-stat-card db-stat-streak" whileHover={{ scale: 1.02 }}>
                            <div className="db-stat-icon">🔥</div>
                            <div className="db-stat-val">{streak}</div>
                            <div className="db-stat-label">Day Streak</div>
                        </motion.div>

                        {/* 7-day avg */}
                        <motion.div className="db-stat-card db-stat-score" whileHover={{ scale: 1.02 }}>
                            <div className="db-stat-icon"><TrendingUp size={20} /></div>
                            <div className="db-stat-val" style={{ color: 'var(--primary)' }}>{trends?.last7DaysAvg ?? '--'}</div>
                            <div className="db-stat-label">7-Day Avg Score</div>
                        </motion.div>

                        {/* Total sessions */}
                        <motion.div className="db-stat-card db-stat-sessions" whileHover={{ scale: 1.02 }}>
                            <div className="db-stat-icon"><Calendar size={20} /></div>
                            <div className="db-stat-val">{trends?.history?.length ?? 0}</div>
                            <div className="db-stat-label">Total Sessions</div>
                        </motion.div>
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="db-grid">

                        {/* ── Daily Quote ── */}
                        <motion.div className="db-card db-quote-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <div className="db-card-label"><Star size={14} /> Daily Inspiration</div>
                            <blockquote className="db-quote">"{dailyQuote.text}"</blockquote>
                            <cite className="db-quote-author">— {dailyQuote.author}</cite>
                        </motion.div>

                        {/* ── Daily Tip ── */}
                        <motion.div className="db-card db-tip-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <div className="db-card-label">💡 Today's Wellness Tip</div>
                            <div className="db-tip-emoji">{dailyTip.emoji}</div>
                            <p className="db-tip-text">{dailyTip.tip}</p>
                        </motion.div>

                        {/* ── Breathing Tool Quick Launch ── */}
                        <motion.div
                            className="db-card db-breath-card"
                            whileHover={{ scale: 1.02 }}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="db-card-label"><Wind size={14} /> Breathing Exercise</div>
                            <div className="db-breath-visual">
                                <motion.div
                                    className="db-breath-circle"
                                    animate={{ scale: [1, 1.18, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                            <p className="db-breath-desc">Reduce stress in 60 seconds with guided breathing</p>
                            <button className="db-breath-btn" onClick={() => setShowBreathing(true)}>
                                Start Session <ChevronRight size={16} />
                            </button>
                        </motion.div>

                        {/* ── Last Assessment Cluster Breakdown ── */}
                        {Object.keys(lastClusterScores).length > 0 && (
                            <motion.div className="db-card db-cluster-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                                <div className="db-card-label"><TrendingUp size={14} /> Last Assessment Breakdown</div>
                                <div className="db-clusters">
                                    {Object.entries(lastClusterScores).map(([cluster, pct]) => (
                                        <div key={cluster} className="db-cluster-row">
                                            <div className="db-cluster-info">
                                                <span className="db-cluster-emoji">{CLUSTER_EMOJIS[cluster] || '📊'}</span>
                                                <span className="db-cluster-name">{cluster.replace('Work/Academic Pressure', 'Work').replace('Emotional Well-being', 'Emotional').replace('Physical & Sleep Health', 'Physical').replace('Social & Lifestyle Balance', 'Social')}</span>
                                                <span className="db-cluster-pct" style={{ color: CLUSTER_COLORS[cluster] || '#a78bfa' }}>{typeof pct === 'number' ? pct : 0}%</span>
                                            </div>
                                            <div className="db-cluster-track">
                                                <motion.div
                                                    className="db-cluster-fill"
                                                    style={{ background: CLUSTER_COLORS[cluster] || '#a78bfa' }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${typeof pct === 'number' ? pct : 0}%` }}
                                                    transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ── Stress Score Card ── */}
                        <motion.div className="db-card db-score-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="db-card-header-row">
                                <div className="db-card-label">Overall Stress Level</div>
                                <span className="db-badge">7-Day Avg</span>
                            </div>
                            <div className="db-score-display">
                                <span className="db-score-num">{trends?.last7DaysAvg ?? '--'}</span>
                                <span className="db-score-denom">/100</span>
                            </div>
                            <p className="db-score-desc">
                                {trends?.dominantCluster
                                    ? `Top stressor: ${trends.dominantCluster}`
                                    : 'Complete assessments to generate insights.'}
                            </p>
                            <div className="db-score-track">
                                <motion.div
                                    className="db-score-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${trends?.last7DaysAvg || 0}%` }}
                                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                                />
                            </div>
                        </motion.div>

                        {/* ── Recent Assessments ── */}
                        <motion.div className="db-card db-history-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <div className="db-card-header-row">
                                <div className="db-card-label">Recent Assessments</div>
                            </div>

                            {trends?.history?.length > 0 ? (
                                <div className="db-history-list">
                                    {trends.history.slice(0, 5).map((session, idx) => {
                                        const scoreNum = Number(session.score);
                                        const levelColor = scoreNum > 60 ? '#f87171' : scoreNum > 30 ? '#fbbf24' : '#34d399';
                                        const levelLabel = scoreNum > 60 ? 'High' : scoreNum > 30 ? 'Moderate' : 'Low';
                                        return (
                                            <motion.div
                                                key={idx}
                                                className="db-history-item"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.08 }}
                                                onClick={() => setSelectedHistory(session)}
                                                whileHover={{ scale: 1.01, x: 4 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <div className="db-history-left">
                                                    <div className="db-history-date">
                                                        {new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="db-history-level" style={{ color: levelColor }}>
                                                        <span className="db-history-dot" style={{ background: levelColor }} />
                                                        {session.level || levelLabel}
                                                    </div>
                                                </div>
                                                <div className="db-history-score" style={{ color: levelColor }}>{scoreNum}/100</div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="db-empty-state">
                                    <div className="db-empty-icon">📊</div>
                                    <p>No assessments yet.</p>
                                    <Link to="/assessment" className="db-empty-cta">Take your first one →</Link>
                                </div>
                            )}
                        </motion.div>

                    </div>
                </motion.div>
            </div>
            <Footer />

            {/* Breathing Tool Modal */}
            <AnimatePresence>
                {showBreathing && <BreathingTool onClose={() => setShowBreathing(false)} />}
            </AnimatePresence>
        </>
    );
};

export default Dashboard;