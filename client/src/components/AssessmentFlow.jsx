import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BasicInfoForm from './BasicInfoForm';
import Questionnaire from './Questionnaire';
import Results from './Results';
import History from './History';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'framer-motion';

const AssessmentFlow = () => {
    const [step, setStep] = useState('basic-info'); // basic-info, loading-questions, test, loading, result, history
    const [userInfo, setUserInfo] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'https://comfy-o2ia.onrender.com';

    const handleBasicInfoSubmit = async (info) => {
        setUserInfo(info);
        setStep('loading-questions');
        try {
            const response = await axios.post(
                `${API_URL}/api/generate-questions`,
                { userInfo: info }
            );

            // The backend formats responses as { success: true, data: { questions: [...] } }
            const generatedData = response.data.data || response.data;

            if (generatedData && generatedData.questions) {
                setQuestions(generatedData.questions);
                setStep('test');
            } else {
                throw new Error("No questions received");
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate personalized questions. Please try again.');
            setStep('basic-info');
        }
    };

    const submitAnswers = async (answers) => {
        setStep('loading');
        try {
            const response = await axios.post(
                `${API_URL}/api/analyze-stress`,
                {
                    userInfo,
                    answers,
                    questions
                }
            );

            setResult(response.data.data || response.data);
            setStep('result');
        } catch (err) {
            console.error(err);
            setError('Failed to analyze results. Please try again.');
            setStep('basic-info');
        }
    };

    const retakeTest = () => {
        setResult(null);
        setUserInfo(null);
        setQuestions([]);
        setStep('basic-info');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div style={{ flex: 1, marginTop: '80px', minHeight: '80vh' }}>
                {step === 'basic-info' && <BasicInfoForm onStart={handleBasicInfoSubmit} />}

                {step === 'loading-questions' && (
                    <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', maxWidth: '600px' }}>
                        <div className="loader" style={{
                            width: '50px', height: '50px',
                            border: '5px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)',
                            borderRadius: '50%', animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Gathering personalized questions...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {step === 'test' && <Questionnaire questions={questions} language={userInfo?.language} onSubmit={submitAnswers} onCancel={() => navigate('/dashboard')} />}

                {step === 'loading' && (
                    <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 auto', maxWidth: '600px' }}>
                        <div className="loader" style={{
                            width: '50px', height: '50px',
                            border: '5px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)',
                            borderRadius: '50%', animation: 'spin 1s linear infinite'
                        }}></div>
                        <p style={{ marginTop: '20px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Analyzing your responses using AI...</p>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {step === 'result' && result && (
                    <Results result={result} onRetake={() => navigate('/dashboard')} />
                )}

                {error && (
                    <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--error)', color: 'white', padding: '10px 20px', borderRadius: '8px', zIndex: 1000 }}>
                        {error}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default AssessmentFlow;
