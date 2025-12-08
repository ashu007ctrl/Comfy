import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { questions } from '../data/questions';
import Header from './Header';
import './Questionnaire.css';

const Questionnaire = ({ onSubmit, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [direction, setDirection] = useState(1);

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
        switch (currentQuestion.type) {
            case 'scale':
                return (
                    <div className="scale-input">
                        <div className="scale-labels">
                            <span>{currentQuestion.minLabel}</span>
                            <motion.span
                                key={answers[currentQuestion.id]}
                                initial={{ scale: 1.2, color: '#c9dbcaff' }}
                                animate={{ scale: 1, color: '#c9dbcaff' }}
                                className="scale-value"
                            >
                                {answers[currentQuestion.id] || 50}
                            </motion.span>
                            <span>{currentQuestion.maxLabel}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={answers[currentQuestion.id] !== undefined ? answers[currentQuestion.id] : 50}
                            onChange={(e) => handleAnswer(Number(e.target.value))}
                            className="gradient-slider"
                        />
                    </div>
                );
            case 'choice':
                return (
                    <div className="choice-input">
                        {currentQuestion.options.map((opt, index) => (
                            <motion.button
                                key={opt.text}
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
                    <div className="yesno-input">
                        <motion.button
                            className={`yesno-btn ${answers[currentQuestion.id] === currentQuestion.yesScore ? 'active' : ''}`}
                            onClick={() => handleAnswer(currentQuestion.yesScore)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Yes
                        </motion.button>
                        <motion.button
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
            <Header />

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
