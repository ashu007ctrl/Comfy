import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BasicInfoForm from './BasicInfoForm';
import Questionnaire from './Questionnaire';
import Results from './Results';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';

const LoadingScreen = ({ message, subtitle }) => (
    <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
        padding: '2rem',
    }}>
        {/* Animated AI icon */}
        <div style={{ position: 'relative' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                style={{
                    width: 68, height: 68,
                    border: '3px solid rgba(167,139,250,0.1)',
                    borderTopColor: 'var(--primary)',
                    borderRightColor: 'rgba(56,189,248,0.5)',
                    borderRadius: '50%',
                }}
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Brain size={24} style={{ color: 'var(--primary)' }} />
            </motion.div>
        </div>

        <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                {message}
            </p>
            {subtitle && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 400 }}>
                    {subtitle}
                </p>
            )}
        </div>

        {/* AI badge */}
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px',
            background: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            borderRadius: '50px',
            fontSize: '0.75rem', fontWeight: 600, color: '#a78bfa',
        }}>
            <Sparkles size={12} /> Powered by Gemini 3.1 Pro
        </div>
    </div>
);

const AssessmentFlow = () => {
    const [step, setStep] = useState('basic-info');
    const [userInfo, setUserInfo] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'https://comfy-o2ia.onrender.com';

    const handleBasicInfoSubmit = async (info) => {
        setUserInfo(info);
        setStep('loading-questions');
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/generate-questions`, { userInfo: info });
            const generatedData = response.data.data || response.data;
            if (generatedData && generatedData.questions) {
                setQuestions(generatedData.questions);
                setStep('test');
            } else {
                throw new Error("No questions received");
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate questions. Please try again.');
            setStep('basic-info');
        }
    };

    const submitAnswers = async (ans) => {
        setAnswers(ans);
        setStep('loading');
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/analyze-stress`, {
                userInfo,
                answers: ans,
                questions,
            });
            setResult(response.data.data || response.data);
            setStep('result');
        } catch (err) {
            console.error(err);
            setError('Failed to analyze results. Please try again.');
            setStep('test');
        }
    };

    const retakeTest = () => {
        setResult(null);
        setUserInfo(null);
        setQuestions([]);
        setAnswers({});
        setStep('basic-info');
        navigate('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div style={{ flex: 1, marginTop: '80px', minHeight: '80vh' }}>
                {step === 'basic-info' && <BasicInfoForm onStart={handleBasicInfoSubmit} />}
                {step === 'loading-questions' && (
                    <LoadingScreen
                        message="Crafting personalized questions for you…"
                        subtitle="Gemini 3.1 Pro is analyzing your profile to generate tailored questions"
                    />
                )}
                {step === 'test' && (
                    <Questionnaire
                        questions={questions}
                        language={userInfo?.language}
                        onSubmit={submitAnswers}
                        onCancel={() => navigate('/dashboard')}
                    />
                )}
                {step === 'loading' && (
                    <LoadingScreen
                        message="Analyzing your responses with AI…"
                        subtitle="Gemini 3.1 Pro is generating your personalized stress analysis"
                    />
                )}
                {step === 'result' && result && (
                    <Results
                        result={result}
                        questions={questions}
                        answers={answers}
                        onRetake={retakeTest}
                    />
                )}
                {error && (
                    <div style={{
                        position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--error)', color: 'white', padding: '12px 24px',
                        borderRadius: '12px', zIndex: 1000, fontWeight: 600,
                        boxShadow: '0 8px 24px rgba(239,68,68,0.4)',
                        maxWidth: '90vw', textAlign: 'center',
                    }}>
                        {error}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AssessmentFlow;
