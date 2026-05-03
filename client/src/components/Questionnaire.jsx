import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Briefcase, Heart, Moon, Users, Leaf, Clock } from 'lucide-react';
import SEOHelmet from './SEOHelmet';
import './Questionnaire.css';

// Cluster metadata — color, icon, emoji
const CLUSTER_META = {
    "Work/Academic Pressure":   { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', icon: Briefcase,  emoji: '💼', label: 'Work / Academic' },
    "Emotional Well-being":     { color: '#f472b6', bg: 'rgba(244,114,182,0.12)', icon: Heart,      emoji: '💙', label: 'Emotional' },
    "Physical & Sleep Health":  { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  icon: Moon,       emoji: '🌙', label: 'Physical & Sleep' },
    "Social & Lifestyle Balance": { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: Users,    emoji: '🤝', label: 'Social' },
    "Lifestyle & Habits":       { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  icon: Leaf,       emoji: '🌿', label: 'Lifestyle' },
};

const ENCOURAGEMENTS = [
    "You're doing great — keep going! 🌟",
    "Each answer helps build a clearer picture 🔍",
    "Honesty here helps you the most 💪",
    "Almost there — you're making progress 🚀",
    "Your well-being matters — thank you for this 💙",
    "Take a breath, you're doing this for you 🌿",
    "No right or wrong answers — just your truth ✨",
    "Every response counts, trust the process 🧠",
];

const SCALE_LABELS_EN = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];
const SCALE_LABELS_HI = ['कभी नहीं', 'शायद ही', 'कभी-कभी', 'अक्सर', 'बहुत अक्सर'];
const SCALE_EMOJIS = ['😌', '🙂', '😐', '😟', '😰'];

const Questionnaire = ({ questions, language = 'English', onSubmit, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [direction, setDirection] = useState(1);
    const [encouragement, setEncouragement] = useState(ENCOURAGEMENTS[0]);

    const isHindi = language === 'Hindi';
    const scaleLabels = isHindi ? SCALE_LABELS_HI : SCALE_LABELS_EN;

    // Rotate encouragement on step change
    useEffect(() => {
        setEncouragement(ENCOURAGEMENTS[currentStep % ENCOURAGEMENTS.length]);
    }, [currentStep]);

    if (!questions || questions.length === 0) {
        return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No questions loaded.</div>;
    }

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;
    const isLastQuestion = currentStep === questions.length - 1;
    const totalMins = Math.ceil((questions.length - currentStep - 1) * 0.4);
    const meta = CLUSTER_META[currentQuestion.cluster] || { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', emoji: '💡', label: currentQuestion.cluster };
    const ClusterIcon = meta.icon || Briefcase;

    const handleAnswer = useCallback((value) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    }, [currentQuestion.id]);

    const handleNext = useCallback(() => {
        if (answers[currentQuestion.id] === undefined) return;
        if (isLastQuestion) {
            onSubmit(answers);
        } else {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        }
    }, [answers, currentQuestion.id, isLastQuestion, onSubmit]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        } else {
            onCancel && onCancel();
        }
    }, [currentStep, onCancel]);

    // Keyboard support (1–5 to answer, Enter/→ to advance, ← to go back)
    useEffect(() => {
        const handleKey = (e) => {
            const n = parseInt(e.key);
            if (n >= 1 && n <= 5) handleAnswer(n);
            if (e.key === 'Enter' || e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handleBack();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleAnswer, handleNext, handleBack]);

    return (
        <div className="q-wrapper">
            <SEOHelmet
                title="Stress Assessment — Comfy"
                description="Answer 10 personalized questions to get your AI stress analysis."
                keywords="stress test, stress assessment, mental health"
                url="https://mycomfyy.netlify.app/assessment"
            />

            {/* Background blobs */}
            <div className="q-bg-blob q-blob-1" style={{ background: `radial-gradient(circle, ${meta.color}33, transparent 70%)` }} />
            <div className="q-bg-blob q-blob-2" />

            <div className="q-container">

                {/* ── Progress ── */}
                <div className="q-progress-wrap">
                    <div className="q-progress-info">
                        <span className="q-progress-step">Question {currentStep + 1} <span className="q-progress-of">of {questions.length}</span></span>
                        <div className="q-time-pill">
                            <Clock size={12} />
                            {totalMins < 1 ? 'Last one!' : `~${totalMins} min left`}
                        </div>
                        <span className="q-progress-pct">{Math.round(progress)}%</span>
                    </div>
                    <div className="q-progress-track">
                        <motion.div
                            className="q-progress-fill"
                            style={{ background: `linear-gradient(90deg, ${meta.color}cc, ${meta.color})` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                        />
                    </div>

                    {/* Cluster dots */}
                    <div className="q-cluster-dots">
                        {questions.map((q, i) => {
                            const m = CLUSTER_META[q.cluster] || meta;
                            return (
                                <div
                                    key={i}
                                    className={`q-cluster-dot ${i === currentStep ? 'current' : ''} ${answers[q.id] !== undefined ? 'answered' : ''}`}
                                    style={{ background: i === currentStep ? m.color : answers[q.id] !== undefined ? m.color + '90' : undefined }}
                                    title={q.cluster}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* ── Question Card ── */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 60, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: direction * -60, scale: 0.96 }}
                        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                        className="q-card"
                        style={{ '--cluster-color': meta.color, '--cluster-bg': meta.bg }}
                    >
                        {/* Cluster badge */}
                        <div className="q-cluster-badge" style={{ background: meta.bg, color: meta.color, borderColor: meta.color + '40' }}>
                            <ClusterIcon size={14} />
                            <span>{meta.emoji} {meta.label}</span>
                        </div>

                        {/* Question text */}
                        <h2 className="q-question">{currentQuestion.text}</h2>

                        {/* Encouragement */}
                        <p className="q-encouragement">{encouragement}</p>

                        {/* Answer cards */}
                        <div className="q-scale-grid" role="radiogroup" aria-label="Rate your answer">
                            {[1, 2, 3, 4, 5].map((val) => {
                                const isActive = answers[currentQuestion.id] === val;
                                return (
                                    <motion.button
                                        key={val}
                                        role="radio"
                                        aria-checked={isActive}
                                        className={`q-scale-card ${isActive ? 'active' : ''}`}
                                        style={isActive ? { borderColor: meta.color, background: meta.bg, boxShadow: `0 0 0 2px ${meta.color}60, 0 8px 24px ${meta.color}30` } : {}}
                                        onClick={() => handleAnswer(val)}
                                        whileHover={{ scale: 1.03, y: -3 }}
                                        whileTap={{ scale: 0.97 }}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (val - 1) * 0.06, duration: 0.3 }}
                                    >
                                        <span className="q-scale-emoji">{SCALE_EMOJIS[val - 1]}</span>
                                        <span className="q-scale-num" style={isActive ? { color: meta.color } : {}}>{val}</span>
                                        <span className="q-scale-label">{scaleLabels[val - 1]}</span>
                                        {isActive && (
                                            <motion.div className="q-scale-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                                                <Check size={12} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Keyboard hint */}
                        <p className="q-keyboard-hint">Press <kbd>1</kbd>–<kbd>5</kbd> to answer · <kbd>→</kbd> to continue</p>

                        {/* Navigation */}
                        <div className="q-nav">
                            <motion.button className="q-back-btn" onClick={handleBack} whileHover={{ scale: 1.04, x: -3 }} whileTap={{ scale: 0.96 }}>
                                <ArrowLeft size={18} /> {currentStep === 0 ? 'Exit' : 'Back'}
                            </motion.button>

                            <motion.button
                                className={`q-next-btn ${answers[currentQuestion.id] === undefined ? 'disabled' : ''}`}
                                style={answers[currentQuestion.id] !== undefined ? { background: `linear-gradient(135deg, ${meta.color}cc, ${meta.color})` } : {}}
                                onClick={handleNext}
                                disabled={answers[currentQuestion.id] === undefined}
                                whileHover={answers[currentQuestion.id] !== undefined ? { scale: 1.04, x: 3 } : {}}
                                whileTap={answers[currentQuestion.id] !== undefined ? { scale: 0.96 } : {}}
                            >
                                {isLastQuestion ? 'Analyze Results' : 'Next'}
                                <ArrowRight size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Questionnaire;
