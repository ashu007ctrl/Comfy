import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

const Results = ({ result, onRetake }) => {
    const { score, level, tips } = result;

    // Color logic
    let color = '#0cc00cff';
    let Icon = CheckCircle;
    let label = 'Low Stress';

    if (score > 30) {
        color = '#0a75aaff';
        Icon = AlertTriangle;
        label = 'Moderate Stress';
    }
    if (score > 60) {
        color = '#0b75aeff';
        Icon = AlertOctagon;
        label = 'High Stress';
    }

    // Fallback if no specific label from backend
    if (level) label = level;

    // Gauge calculation (180 degree arc)
    const rotation = (score / 100) * 180 - 90; // -90 to +90

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '4rem auto', paddingBottom: '4rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="card"
                style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
                <h2 style={{ marginBottom: '2rem', color: '#303230ff' }}>Your Stress Assessment Results</h2>

                {/* Gauge Visual */}
                <div style={{ position: 'relative', width: '250px', height: '125px', margin: '0 auto 2rem', overflow: 'hidden' }}>
                    <div style={{
                        width: '250px', height: '250px', borderRadius: '50%', background: '#e2e8f0', position: 'absolute', top: 0, left: 0
                    }}></div>
                    <motion.div
                        initial={{ rotate: -90 }}
                        animate={{ rotate: rotation }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{
                            width: '250px', height: '250px', borderRadius: '50%',
                            background: `conic-gradient(from 180deg at 50% 100%, ${color} 0%, transparent 100%)`, // Simplified fill
                            // Better approach: rotate a semi-circle needle or bar
                            // For simplicity, let's use a semi-circle border or needle
                            border: `20px solid ${color}`,
                            borderBottom: 'none',
                            borderRight: 'none',
                            position: 'absolute', top: 0, left: 0, // This is tricky with pure CSS div rotation, let's just use a simple SVG
                            display: 'none' // hiding the complex div attempt
                        }}
                    />

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
                            strokeDashoffset={314 - (314 * score / 100)} // strokeDashoffset animates line
                            initial={{ strokeDashoffset: 314 }}
                            animate={{ strokeDashoffset: 314 - (314 * score / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>

                    <div style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>
                        <span style={{ fontSize: '3rem', fontWeight: 'bold', color: color }}>{Math.round(score)}</span>
                        <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/100</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}>
                    <Icon size={32} color={color} />
                    <h3 style={{ fontSize: '2rem', color: color }}>{label}</h3>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                >
                    <h3 style={{ marginBottom: '1.5rem' }}>Personalized Tips</h3>
                    <ul style={{ listStyle: 'none' }}>
                        {tips && tips.map((tip, index) => (
                            <li key={index} style={{ marginBottom: '1rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                                    {index + 1}
                                </div>
                                <span>{tip}</span>
                            </li>
                        ))}
                        {!tips && <li>No specific tips generated. Try again!</li>}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                >
                    <h3 style={{ marginBottom: '1rem' }}>Take Action</h3>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        Regular assessment helps track your mental well-being. Come back anytime to check your progress.
                    </p>
                    <button className="btn btn-outline" onClick={onRetake}>
                        <RefreshCcw size={20} style={{ marginRight: '10px' }} /> Retake Test
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default Results;
