import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
// import { questions } from '../data/questions'; // REMOVED STATIC IMPORT
import SEOHelmet from './SEOHelmet';
import './Questionnaire.css';

const Questionnaire = ({ questions, language = 'English', onSubmit, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [direction, setDirection] = useState(1);

    if (!questions || questions.length === 0) {
        return <div className="p-10 text-center">No questions loaded.</div>;
    }

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;
    const isLastQuestion = currentStep === questions.length - 1;

    const handleAnswer = (value) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const handleNext = () => {
        if (answers[currentQuestion.id] === undefined) return;

        if (isLastQuestion) {
            onSubmit(answers);
        } else {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        } else {
            onCancel && onCancel();
        }
    };

    const renderInput = () => {
        // Default to scale if type not specified
        const type = currentQuestion.type || 'scale';

        switch (type) {
            case 'scale':
                return (
                    <div className="scale-input-buttons" role="radiogroup">
                        {[1, 2, 3, 4, 5].map((val) => {
                            let label = "";
                            if (language === 'Hindi') {
                                if (val === 1) label = currentQuestion.minLabel || "कभी नहीं";
                                if (val === 2) label = "शायद ही कभी";
                                if (val === 3) label = "कभी-कभी";
                                if (val === 4) label = "अक्सर";
                                if (val === 5) label = currentQuestion.maxLabel || "बहुत बार";
                            } else {
                                if (val === 1) label = currentQuestion.minLabel || "Never";
                                if (val === 2) label = "Rarely";
                                if (val === 3) label = "Sometimes";
                                if (val === 4) label = "Often";
                                if (val === 5) label = currentQuestion.maxLabel || "Very Often";
                            }

                            const isActive = answers[currentQuestion.id] === val;
                            return (
                                <motion.button
                                    key={val}
                                    role="radio"
                                    aria-checked={isActive}
                                    className={`scale-btn ${isActive ? 'active' : ''}`}
                                    onClick={() => handleAnswer(val)}
                                    whileHover={{ scale: 1.01, x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="scale-btn-num">{val}</span>
                                    <span className="scale-btn-label">{label}</span>
                                    <span className="scale-btn-val">{val}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                );
            case 'choice':
                return (
                    <div className="choice-input" role="radiogroup" aria-label="Select an option">
                        {currentQuestion.options.map((opt, index) => (
                            <motion.button
                                key={opt.text}
                                role="radio"
                                aria-checked={answers[currentQuestion.id] === opt.score}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`choice-btn ${answers[currentQuestion.id] === opt.score ? 'active' : ''}`}
                                onClick={() => handleAnswer(opt.score)}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>{opt.text}</span>
                                {answers[currentQuestion.id] === opt.score && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Check size={20} />
                                    </motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                );
            case 'yesno':
                return (
                    <div className="yesno-input" role="radiogroup" aria-label="Yes or No">
                        <motion.button
                            role="radio"
                            aria-checked={answers[currentQuestion.id] === currentQuestion.yesScore}
                            className={`yesno-btn ${answers[currentQuestion.id] === currentQuestion.yesScore ? 'active' : ''}`}
                            onClick={() => handleAnswer(currentQuestion.yesScore)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Yes
                        </motion.button>
                        <motion.button
                            role="radio"
                            aria-checked={answers[currentQuestion.id] === currentQuestion.noScore}
                            className={`yesno-btn ${answers[currentQuestion.id] === currentQuestion.noScore ? 'active' : ''}`}
                            onClick={() => handleAnswer(currentQuestion.noScore)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            No
                        </motion.button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="questionnaire-wrapper">
            <SEOHelmet
                title="Free Stress Assessment Test - Comfy"
                description="Take our scientifically designed 10-question stress assessment test. Get instant AI-powered analysis and personalized stress management recommendations."
                keywords="free stress test, stress assessment, stress questionnaire, mental health test, anxiety test, psychological assessment, stress analysis"
                url="https://mycomfyy.netlify.app/questionnaire"
            />

            <div className="questionnaire-container">
                <motion.div
                    className="questionnaire-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Progress Section */}
                    <div className="progress-section">
                        <div className="progress-info">
                            <span className="progress-label">Question {currentStep + 1} of {questions.length}</span>
                            <span className="progress-percent">{Math.round(progress)}%</span>
                        </div>
                        <div className="progress-bar-container">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        </div>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode='wait' custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="question-card"
                        >
                            <h2 className="question-text">{currentQuestion.text}</h2>
                            <div className="question-input">
                                {renderInput()}
                            </div>

                            {/* Navigation Buttons */}
                            <div className="navigation-buttons">
                                <motion.button
                                    className="back-btn"
                                    onClick={handleBack}
                                    whileHover={{ scale: 1.05, x: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        whileHover={{ x: -3 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ArrowLeft size={20} />
                                    </motion.div>
                                    <span>Back</span>
                                </motion.button>

                                <motion.button
                                    className={`next-btn ${answers[currentQuestion.id] === undefined ? 'disabled' : ''}`}
                                    onClick={handleNext}
                                    disabled={answers[currentQuestion.id] === undefined}
                                    whileHover={answers[currentQuestion.id] !== undefined ? { scale: 1.05, x: 5 } : {}}
                                    whileTap={answers[currentQuestion.id] !== undefined ? { scale: 0.95 } : {}}
                                    animate={answers[currentQuestion.id] !== undefined ? {
                                        boxShadow: [
                                            "0 10px 30px rgba(124, 58, 237, 0.3)",
                                            "0 10px 40px rgba(124, 58, 237, 0.5)",
                                            "0 10px 30px rgba(124, 58, 237, 0.3)"
                                        ]
                                    } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <span>{isLastQuestion ? 'Submit & Analyze' : 'Next'}</span>
                                    <motion.div
                                        whileHover={{ x: 3 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ArrowRight size={20} />
                                    </motion.div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Questionnaire;
