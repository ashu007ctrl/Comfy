import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, Wind } from 'lucide-react';
import './BreathingTool.css';

const TECHNIQUES = [
    {
        id: 'box',
        name: 'Box Breathing',
        subtitle: 'Calm & focus',
        description: 'Favoured by Navy SEALs and athletes. Equal 4-count phases reset your nervous system in under 2 minutes.',
        phases: [
            { label: 'Inhale', duration: 4, color: '#38bdf8' },
            { label: 'Hold',   duration: 4, color: '#a78bfa' },
            { label: 'Exhale', duration: 4, color: '#34d399' },
            { label: 'Hold',   duration: 4, color: '#fbbf24' },
        ],
        emoji: '🟦',
        color: '#38bdf8',
    },
    {
        id: '478',
        name: '4-7-8 Breathing',
        subtitle: 'Reduce anxiety',
        description: 'Activates the parasympathetic nervous system. Excellent before sleep, a difficult conversation, or a stressful moment.',
        phases: [
            { label: 'Inhale', duration: 4, color: '#38bdf8' },
            { label: 'Hold',   duration: 7, color: '#a78bfa' },
            { label: 'Exhale', duration: 8, color: '#34d399' },
        ],
        emoji: '💜',
        color: '#a78bfa',
    },
    {
        id: 'deep',
        name: 'Deep Belly Breath',
        subtitle: 'Quick desk reset',
        description: 'Simple diaphragmatic breathing. A 60-second pattern that cuts cortisol and clears mental fog — great mid-workday.',
        phases: [
            { label: 'Inhale', duration: 3, color: '#38bdf8' },
            { label: 'Exhale', duration: 6, color: '#34d399' },
        ],
        emoji: '🌿',
        color: '#34d399',
    },
];

const DURATIONS = [
    { label: '1 min', seconds: 60 },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
];

const BreathingTool = ({ onClose }) => {
    const [selectedTech, setSelectedTech] = useState(TECHNIQUES[0]);
    const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
    const [isRunning, setIsRunning] = useState(false);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [phaseCount, setPhaseCount] = useState(0);
    const [totalElapsed, setTotalElapsed] = useState(0);
    const [cycles, setCycles] = useState(0);
    const intervalRef = useRef(null);

    const phases = selectedTech.phases;
    const currentPhase = phases[phaseIndex];
    const totalDuration = selectedDuration.seconds;
    const timeLeft = totalDuration - totalElapsed;
    const isFinished = totalElapsed >= totalDuration;
    const overallProgress = Math.min(totalElapsed / totalDuration, 1);

    // Timer tick
    useEffect(() => {
        if (!isRunning || isFinished) return;
        intervalRef.current = setInterval(() => {
            setPhaseCount(prev => {
                const next = prev + 1;
                if (next >= currentPhase.duration) {
                    setPhaseIndex(pi => {
                        const nextPi = (pi + 1) % phases.length;
                        if (nextPi === 0) setCycles(c => c + 1);
                        return nextPi;
                    });
                    return 0;
                }
                return next;
            });
            setTotalElapsed(prev => prev + 1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [isRunning, phaseIndex, currentPhase.duration, phases.length, isFinished]);

    const reset = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setPhaseIndex(0);
        setPhaseCount(0);
        setTotalElapsed(0);
        setCycles(0);
    };

    const handleTechChange = (tech) => { reset(); setSelectedTech(tech); };
    const handleDurationChange = (dur) => { reset(); setSelectedDuration(dur); };

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const circleScale = isRunning && !isFinished
        ? currentPhase.label === 'Inhale' ? 1
        : currentPhase.label === 'Exhale' ? 0.7
        : 0.85
        : 0.82;

    return (
        <motion.div
            className="bt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                className="bt-panel"
                initial={{ scale: 0.9, opacity: 0, y: 32 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 32 }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            >

                {/* ── Top bar ── */}
                <div className="bt-topbar">
                    <div className="bt-header">
                        <Wind size={20} style={{ color: selectedTech.color }} />
                        <h3>Breathing Exercise</h3>
                    </div>
                    <motion.button
                        className="bt-close-top"
                        onClick={onClose}
                        aria-label="Close breathing tool"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <X size={15} /> Close
                    </motion.button>
                </div>

                {/* ── Two-column body ── */}
                <div className="bt-body">

                    {/* ── LEFT: circle + tech selector ── */}
                    <div className="bt-left">
                        {/* Technique tabs */}
                        <div className="bt-tech-selector">
                            {TECHNIQUES.map(t => (
                                <motion.button
                                    key={t.id}
                                    className={`bt-tech-btn ${selectedTech.id === t.id ? 'active' : ''}`}
                                    style={selectedTech.id === t.id
                                        ? { borderColor: t.color, color: t.color, background: t.color + '18' }
                                        : {}}
                                    onClick={() => handleTechChange(t)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {t.emoji} {t.name}
                                </motion.button>
                            ))}
                        </div>

                        {/* Breathing circle */}
                        <div className="bt-circle-wrap">
                            <motion.div
                                className="bt-glow-ring"
                                animate={isRunning && !isFinished
                                    ? { scale: [1, 1.14, 1], opacity: [0.25, 0.5, 0.25] }
                                    : { scale: 1, opacity: 0.15 }}
                                transition={{ duration: currentPhase.duration, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ background: `radial-gradient(circle, ${currentPhase.color}45, transparent 70%)` }}
                            />

                            <motion.div
                                className="bt-circle"
                                animate={{ scale: circleScale }}
                                transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
                                style={{
                                    borderColor: currentPhase.color,
                                    boxShadow: `0 0 50px ${currentPhase.color}45, inset 0 0 40px ${currentPhase.color}12`,
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {isFinished ? (
                                        <motion.div
                                            key="done"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bt-circle-content"
                                        >
                                            <span className="bt-done-emoji">✨</span>
                                            <span className="bt-done-text">Done!</span>
                                            <span className="bt-done-sub">{cycles} cycles</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={`${phaseIndex}-${isRunning}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="bt-circle-content"
                                        >
                                            <span className="bt-phase-label" style={{ color: currentPhase.color }}>
                                                {isRunning ? currentPhase.label : 'Ready'}
                                            </span>
                                            <span className="bt-phase-count">
                                                {isRunning ? currentPhase.duration - phaseCount : ''}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* SVG progress ring */}
                            <svg className="bt-svg-ring" viewBox="0 0 140 140">
                                <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                <motion.circle
                                    cx="70" cy="70" r="64"
                                    fill="none"
                                    stroke={currentPhase.color}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 64}`}
                                    strokeDashoffset={`${2 * Math.PI * 64 * (1 - overallProgress)}`}
                                    style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                                    transition={{ duration: 0.8 }}
                                />
                            </svg>
                        </div>

                        {/* Timer */}
                        <div className="bt-timer-row">
                            <span className="bt-timer">{formatTime(Math.max(timeLeft, 0))}</span>
                            <span className="bt-cycles-badge">{cycles} {cycles === 1 ? 'cycle' : 'cycles'}</span>
                        </div>

                        {/* Phase chips */}
                        <div className="bt-phases">
                            {phases.map((p, i) => (
                                <div
                                    key={i}
                                    className={`bt-phase-chip ${i === phaseIndex && isRunning ? 'active' : ''}`}
                                    style={{
                                        borderColor: p.color + '55',
                                        color: i === phaseIndex && isRunning ? p.color : undefined,
                                    }}
                                >
                                    <div className="bt-phase-dot" style={{ background: p.color }} />
                                    {p.label} · {p.duration}s
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: settings + controls ── */}
                    <div className="bt-right">

                        {/* Description */}
                        <div className="bt-desc-box" style={{ borderColor: selectedTech.color + '30' }}>
                            <div className="bt-desc-title" style={{ color: selectedTech.color }}>
                                {selectedTech.emoji} {selectedTech.name}
                                <span style={{ marginLeft: 8, fontSize: '0.75rem', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textTransform: 'none' }}>
                                    — {selectedTech.subtitle}
                                </span>
                            </div>
                            <p className="bt-desc">{selectedTech.description}</p>
                        </div>

                        {/* Phase sequence preview */}
                        <div>
                            <div className="bt-section-label">Sequence</div>
                            <div className="bt-sequence-preview">
                                {phases.map((p, i) => (
                                    <React.Fragment key={i}>
                                        <motion.div
                                            className={`bt-seq-step ${i === phaseIndex && isRunning ? 'active' : ''}`}
                                            style={i === phaseIndex && isRunning
                                                ? { borderColor: p.color + '70', background: p.color + '14' }
                                                : {}}
                                        >
                                            <span className="bt-seq-label" style={i === phaseIndex && isRunning ? { color: p.color } : {}}>{p.label}</span>
                                            <span className="bt-seq-dur" style={i === phaseIndex && isRunning ? { color: p.color } : {}}>{p.duration}s</span>
                                        </motion.div>
                                        {i < phases.length - 1 && <span className="bt-seq-arrow">→</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div>
                            <div className="bt-section-label">Session Duration</div>
                            <div className="bt-dur-selector">
                                {DURATIONS.map(d => (
                                    <button
                                        key={d.label}
                                        className={`bt-dur-btn ${selectedDuration.label === d.label ? 'active' : ''}`}
                                        style={selectedDuration.label === d.label
                                            ? { borderColor: selectedTech.color + '70', color: selectedTech.color }
                                            : {}}
                                        onClick={() => handleDurationChange(d)}
                                        disabled={isRunning}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div>
                            <div className="bt-section-label">Controls</div>
                            <div className="bt-controls">
                                <motion.button
                                    className="bt-reset-btn"
                                    onClick={reset}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.93 }}
                                    title="Reset"
                                >
                                    <RotateCcw size={17} />
                                </motion.button>

                                <motion.button
                                    className={`bt-play-btn ${isFinished ? 'bt-play-btn--done' : ''}`}
                                    style={{
                                        background: `linear-gradient(135deg, ${selectedTech.color}cc, ${selectedTech.color})`,
                                        boxShadow: `0 6px 24px ${selectedTech.color}40`,
                                    }}
                                    onClick={() => !isFinished && setIsRunning(r => !r)}
                                    whileHover={!isFinished ? { scale: 1.03 } : {}}
                                    whileTap={!isFinished ? { scale: 0.97 } : {}}
                                >
                                    {isFinished
                                        ? '✨ Session Complete'
                                        : isRunning
                                        ? <><Pause size={19} /> Pause</>
                                        : <><Play size={19} /> {totalElapsed > 0 ? 'Resume' : 'Start'}</>
                                    }
                                </motion.button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Bottom close bar ── */}
                <div className="bt-close-bar">
                    <motion.button
                        className="bt-close-bottom"
                        onClick={onClose}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <X size={15} /> Close Breathing Session
                    </motion.button>
                </div>

            </motion.div>
        </motion.div>
    );
};

export default BreathingTool;
