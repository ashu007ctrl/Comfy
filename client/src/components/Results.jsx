import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, CheckCircle, AlertTriangle, AlertOctagon, Info, Lightbulb, Wind, Target, Share2, Check, ChevronDown, ChevronUp, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEOHelmet from './SEOHelmet';
import BreathingTool from './BreathingTool';
import './Results.css';

const CLUSTER_META = {
    "Work/Academic Pressure":   { color: '#a78bfa', emoji: '💼', short: 'Work' },
    "Emotional Well-being":     { color: '#f472b6', emoji: '💙', short: 'Emotional' },
    "Physical & Sleep Health":  { color: '#38bdf8', emoji: '🌙', short: 'Physical' },
    "Social & Lifestyle Balance": { color: '#fbbf24', emoji: '🤝', short: 'Social' },
    "Lifestyle & Habits":       { color: '#34d399', emoji: '🌿', short: 'Lifestyle' },
};

const LEVEL_THEME = {
    Low:      { color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', Icon: CheckCircle,  label: 'Low' },
    Moderate: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  Icon: AlertTriangle, label: 'Moderate' },
    High:     { color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)', Icon: AlertOctagon,  label: 'High' },
};

// Detect level key (works with translated strings too)
const detectLevelKey = (level = '') => {
    const l = level.toLowerCase();
    if (l.includes('high') || l.includes('उच्च')) return 'High';
    if (l.includes('moderate') || l.includes('मध्यम')) return 'Moderate';
    return 'Low';
};

// Build cluster scores from questions + answers
const buildClusterScores = (questions = [], answers = {}) => {
    const acc = {};
    questions.forEach(q => {
        if (!acc[q.cluster]) acc[q.cluster] = { sum: 0, count: 0 };
        acc[q.cluster].sum += (Number(answers[q.id]) || 0);
        acc[q.cluster].count += 1;
    });
    const out = {};
    Object.keys(acc).forEach(k => {
        out[k] = acc[k].count > 0 ? Math.round((acc[k].sum / acc[k].count / 5) * 100) : 0;
    });
    return out;
};

const Results = ({ result, onRetake, questions, answers }) => {
    const { user } = useAuth();
    const [showBreathing, setShowBreathing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [tipsExpanded, setTipsExpanded] = useState(false);

    const {
        score = 0,
        level = 'Low',
        analysis = {},
        personalizedTips = [],
        wellnessPlan = {},
        disclaimer = "Results are for informational purposes only.",
        clusterScores: serverClusterScores,
    } = result || {};

    const { summary, keyStressors, stressLevelExplanation } = analysis;
    const { weeklyGoals = [], techniqueRecommended, reasonForTechnique } = wellnessPlan;

    // Use server cluster scores if available, otherwise build from questions/answers
    const clusterScores = serverClusterScores || (questions && answers ? buildClusterScores(questions, answers) : {});

    const levelKey = detectLevelKey(level);
    const theme = LEVEL_THEME[levelKey] || LEVEL_THEME.Low;
    const { color, bg, border, Icon } = theme;

    const handleShare = () => {
        const text = `My Comfy stress assessment:\n• Score: ${Math.round(score)}/100 (${level})\n• Key stressors: ${(keyStressors || []).join(', ')}\n• Top tip: ${personalizedTips[0]?.title || 'N/A'}\n\nTry it free at mycomfyy.netlify.app`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const visibleTips = tipsExpanded ? personalizedTips : personalizedTips.slice(0, 3);

    return (
        <div className="res-wrapper">
            <SEOHelmet
                title="Your Stress Analysis — Comfy"
                description="View your personalized AI stress assessment results and wellness recommendations."
                keywords="stress results, stress analysis, mental health, wellness"
                url="https://mycomfyy.netlify.app/results"
            />

            {/* Ambient background */}
            <div className="res-bg-blob" style={{ background: `radial-gradient(circle, ${color}28, transparent 70%)` }} />

            <div className="res-container">

                {/* ── Score Hero Card ── */}
                <motion.div
                    className="res-card res-score-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    style={{ borderColor: border }}
                >
                    {/* Top glow accent */}
                    <div className="res-card-accent" style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />

                    {/* Level badge */}
                    <div className="res-level-badge" style={{ background: bg, borderColor: border, color }}>
                        <Icon size={18} />
                        <span>{level} Stress</span>
                    </div>

                    {/* SVG Gauge */}
                    <div className="res-gauge-wrap">
                        <svg viewBox="0 0 220 130" className="res-gauge-svg">
                            <path d="M 20 115 A 90 90 0 0 1 200 115" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" strokeLinecap="round" />
                            <motion.path
                                d="M 20 115 A 90 90 0 0 1 200 115"
                                fill="none"
                                stroke={color}
                                strokeWidth="18"
                                strokeLinecap="round"
                                strokeDasharray="283"
                                initial={{ strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: 283 - (283 * score / 100) }}
                                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
                                style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
                            />
                        </svg>
                        <div className="res-score-center">
                            <motion.span
                                className="res-score-num"
                                style={{ color }}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                            >
                                {Math.round(score)}
                            </motion.span>
                            <span className="res-score-denom">/100</span>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="res-summary-block">
                        <p className="res-summary-text">{summary || stressLevelExplanation || 'Analysis complete.'}</p>
                    </div>

                    {/* Action row */}
                    <div className="res-action-row">
                        <motion.button className="res-breath-btn" onClick={() => setShowBreathing(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Wind size={16} /> Try Breathing Exercise
                        </motion.button>
                        <motion.button className="res-share-btn" onClick={handleShare} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            {copied ? <><Check size={15} /> Copied!</> : <><Share2 size={15} /> Share Results</>}
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Cluster Breakdown ── */}
                {Object.keys(clusterScores).length > 0 && (
                    <motion.div className="res-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="res-card-title"><Info size={18} /> Stress Breakdown by Area</h3>
                        <div className="res-clusters">
                            {Object.entries(clusterScores).map(([cluster, pct], i) => {
                                const m = CLUSTER_META[cluster] || { color: '#a78bfa', emoji: '📊', short: cluster };
                                return (
                                    <motion.div key={cluster} className="res-cluster-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                                        <div className="res-cluster-header">
                                            <span className="res-cluster-name">{m.emoji} {cluster}</span>
                                            <span className="res-cluster-pct" style={{ color: m.color }}>{pct}%</span>
                                        </div>
                                        <div className="res-cluster-track">
                                            <motion.div
                                                className="res-cluster-fill"
                                                style={{ background: `linear-gradient(90deg, ${m.color}80, ${m.color})`, boxShadow: `0 0 10px ${m.color}40` }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.12, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ── Key Stressors ── */}
                {keyStressors && keyStressors.length > 0 && (
                    <motion.div className="res-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                        <h3 className="res-card-title" style={{ color: '#f87171' }}>🔍 Key Stressors Identified</h3>
                        <div className="res-stressors">
                            {keyStressors.map((s, i) => (
                                <span key={i} className="res-stressor-tag">{s}</span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Personalized Tips ── */}
                {personalizedTips.length > 0 && (
                    <motion.div className="res-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <h3 className="res-card-title"><Lightbulb size={18} style={{ color: '#fbbf24' }} /> Personalized Recommendations</h3>
                        <div className="res-tips">
                            {visibleTips.map((tip, i) => (
                                <motion.div key={i} className="res-tip-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.08 }}>
                                    <div className="res-tip-num">{i + 1}</div>
                                    <div>
                                        <div className="res-tip-title">{tip.title || `Tip ${i + 1}`}</div>
                                        <div className="res-tip-desc">{tip.description || tip}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {personalizedTips.length > 3 && (
                            <button className="res-expand-btn" onClick={() => setTipsExpanded(e => !e)}>
                                {tipsExpanded ? <><ChevronUp size={16} /> Show less</> : <><ChevronDown size={16} /> Show {personalizedTips.length - 3} more tips</>}
                            </button>
                        )}
                    </motion.div>
                )}

                {/* ── Wellness Plan ── */}
                {(weeklyGoals.length > 0 || techniqueRecommended) && (
                    <motion.div className="res-card res-wellness-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                        <h3 className="res-card-title"><Target size={18} style={{ color: '#a78bfa' }} /> Your 7-Day Wellness Plan</h3>

                        {weeklyGoals.length > 0 && (
                            <div className="res-goals">
                                {weeklyGoals.map((goal, i) => (
                                    <div key={i} className="res-goal-item">
                                        <div className="res-goal-check"><Check size={13} /></div>
                                        <span>{goal}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {techniqueRecommended && (
                            <div className="res-technique-card">
                                <div className="res-technique-label">🎯 Recommended Technique</div>
                                <div className="res-technique-name">{techniqueRecommended}</div>
                                {reasonForTechnique && <div className="res-technique-reason">{reasonForTechnique}</div>}
                                {techniqueRecommended.toLowerCase().includes('breath') && (
                                    <button className="res-try-breath-btn" onClick={() => setShowBreathing(true)}>
                                        <Wind size={14} /> Try it now →
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── Guest Save Banner ── */}
                {!user && (
                    <motion.div
                        className="res-guest-banner"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="res-guest-text">
                            <span className="res-guest-emoji">✨</span>
                            <div>
                                <div className="res-guest-title">Want to track your progress over time?</div>
                                <div className="res-guest-sub">Create a free account to save results, view trends, and access your personal wellness dashboard.</div>
                            </div>
                        </div>
                        <div className="res-guest-actions">
                            <Link to="/register" className="res-guest-cta-primary">
                                <LogIn size={15} /> Create Free Account
                            </Link>
                            <Link to="/login" className="res-guest-cta-secondary">Sign In</Link>
                        </div>
                    </motion.div>
                )}

                {/* ── Retake ── */}
                <motion.div className="res-retake-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
                    <button className="res-retake-btn" onClick={onRetake}>
                        <RefreshCcw size={16} /> Take Another Assessment
                    </button>
                </motion.div>

                {/* Disclaimer */}
                <p className="res-disclaimer">{disclaimer}</p>
            </div>

            {/* Breathing Modal */}
            <AnimatePresence>
                {showBreathing && <BreathingTool onClose={() => setShowBreathing(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default Results;
