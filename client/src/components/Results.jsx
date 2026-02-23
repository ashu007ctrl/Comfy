import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, CheckCircle, AlertTriangle, AlertOctagon, Info, Lightbulb } from 'lucide-react';
import SEOHelmet from './SEOHelmet';

const Results = ({ result, onRetake }) => {
    // Destructure with default fallbacks
    const {
        score = 0,
        level = 'Unknown',
        analysis = {},
        personalizedTips = [],
        disclaimer = "Results are for informational purposes only."
    } = result || {};

    const { summary, keyStressors, stressLevelExplanation } = analysis;

    // Color logic
    let color = '#0cc00cff';
    let Icon = CheckCircle;

    if (score > 30) {
        color = '#0a75aaff';
        Icon = AlertTriangle;
    }
    if (score > 60) {
        color = '#0b75aeff';
        Icon = AlertOctagon;
    }

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '4rem auto', paddingBottom: '4rem' }}>
            <SEOHelmet
                title="Your Stress Analysis Results - Comfy"
                description="View your personalized stress assessment results and AI-powered recommendations."
                keywords="stress results, stress analysis, mental health results, stress score"
                url="https://mycomfyy.netlify.app/results"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="card"
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Your Stress Assessment</h2>

                {/* Gauge Visual */}
                <div style={{ position: 'relative', width: '250px', height: '140px', margin: '0 auto 1rem', overflow: 'hidden' }}>

                    {/* SVG Gauge */}
                    <svg width="250" height="140" viewBox="0 0 250 140" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <path d="M 25 125 A 100 100 0 0 1 225 125" fill="none" stroke="#e2e8f0" strokeWidth="20" strokeLinecap="round" />
                        <motion.path
                            d="M 25 125 A 100 100 0 0 1 225 125"
                            fill="none"
                            stroke={color}
                            strokeWidth="20"
                            strokeLinecap="round"
                            strokeDasharray="314" // Length of arc ~ pi * 100
                            strokeDashoffset={314 - (314 * score / 100)}
                            initial={{ strokeDashoffset: 314 }}
                            animate={{ strokeDashoffset: 314 - (314 * score / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>

                    <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: color }}>{Math.round(score)}</span>
                        <span style={{ fontSize: '1rem', color: '#64748b' }}>/100</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '2rem' }}>
                    <Icon size={32} color={color} />
                    <h3 style={{ fontSize: '2rem', color: color }}>{level}</h3>
                </div>

                <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        <Info size={18} /> Analysis Summary
                    </h4>
                    <p style={{ color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '1.05rem', letterSpacing: '0.01em' }}>{summary || stressLevelExplanation || "Analysis unavailable."}</p>
                </div>

            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Personalized Tips Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                    style={{ gridColumn: '1 / -1' }}
                >
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lightbulb size={24} color="#eab308" /> Personalized Tips
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {personalizedTips.length > 0 ? personalizedTips.map((tip, index) => (
                            <li key={index} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: 'var(--glass-border)' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                    {tip.title || `Tip ${index + 1}`}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.6', letterSpacing: '0.01em' }}>
                                    {tip.description || tip}
                                </div>
                            </li>
                        )) : (
                            <li>No specific tips generated.</li>
                        )}
                    </ul>
                </motion.div>

                {/* Key Stressors Section (Full Width Now) */}
                {keyStressors && keyStressors.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card"
                        style={{ gridColumn: '1 / -1' }}
                    >
                        <h3 style={{ marginBottom: '1rem', color: '#ef4444' }}>Key Stressors Identified</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {keyStressors.map((s, i) => (
                                <span key={i} style={{ display: 'inline-block', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '8px 14px', borderRadius: '16px', fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.4' }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Take Action Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card"
                    style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                >
                    <h3 style={{ marginBottom: '1rem' }}>Take Action</h3>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        Regular assessment helps track your mental well-being.
                    </p>
                    <button className="btn btn-outline" onClick={onRetake}>
                        <RefreshCcw size={20} style={{ marginRight: '10px' }} /> Retake Assessment
                    </button>
                </motion.div>

            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                <p>{disclaimer}</p>
            </div>
        </div >
    );
};

export default Results;
