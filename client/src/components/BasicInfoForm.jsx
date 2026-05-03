import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, Smile, ArrowRight, Sparkles, Globe, Moon, Activity, ChevronRight, ChevronLeft, MessageSquare } from 'lucide-react';
import './BasicInfoForm.css';

const STEPS = ['about', 'lifestyle'];

const OCCUPATION_TYPES = [
    { value: 'student', label: 'Student' },
    { value: 'working_professional', label: 'Working Professional' },
    { value: 'freelancer', label: 'Freelancer / Self-Employed' },
    { value: 'business_owner', label: 'Business Owner' },
    { value: 'homemaker', label: 'Homemaker' },
    { value: 'retired', label: 'Retired' },
    { value: 'other', label: 'Other' },
];

const ACTIVITY_LEVELS = [
    { value: 'sedentary', label: 'Sedentary (mostly sitting)' },
    { value: 'light', label: 'Light (occasional walks)' },
    { value: 'moderate', label: 'Moderate (exercise 2–3x/week)' },
    { value: 'active', label: 'Active (exercise 4+x/week)' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }
};

const BasicInfoForm = ({ onStart }) => {
    const [step, setStep] = useState(0); // 0 = About You, 1 = Lifestyle
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        occupation: '',
        occupationType: '',
        mood: '',
        language: 'English',
        sleepHours: '',
        activityLevel: '',
        stressContext: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isStep0Valid = formData.age && formData.gender;
    const isStep1Valid = true; // lifestyle fields are optional

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 0 && isStep0Valid) setStep(1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        onStart(formData);
    };

    return (
        <div className="bif-container">
            {/* Ambient orbs */}
            <div className="bif-orb bif-orb-1" />
            <div className="bif-orb bif-orb-2" />
            <div className="bif-orb bif-orb-3" />

            <motion.div
                className="bif-card"
                initial={{ opacity: 0, scale: 0.93, y: 28 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Top shimmer */}
                <div className="bif-shimmer" />

                {/* Step indicator */}
                <div className="bif-steps">
                    {STEPS.map((s, i) => (
                        <div key={s} className={`bif-step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
                    ))}
                    <span className="bif-step-label">{step === 0 ? 'About You' : 'Lifestyle'}</span>
                </div>

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                        >
                            <motion.h2 variants={itemVariants}>Tell us about yourself</motion.h2>
                            <motion.p className="bif-subtitle" variants={itemVariants}>
                                Helps our AI craft questions made for your life.
                            </motion.p>

                            <form onSubmit={handleNext}>
                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><Globe size={14} /> Language</label>
                                    <select name="language" value={formData.language} onChange={handleChange} required>
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi (हिंदी)</option>
                                    </select>
                                </motion.div>

                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><User size={14} /> Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="e.g. 24"
                                        required min="10" max="100"
                                    />
                                </motion.div>

                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><User size={14} /> Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Non-binary">Non-binary</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </motion.div>

                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><Briefcase size={14} /> Occupation Type</label>
                                    <select name="occupationType" value={formData.occupationType} onChange={handleChange}>
                                        <option value="">Select type (optional)</option>
                                        {OCCUPATION_TYPES.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </motion.div>

                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><Briefcase size={14} /> Your Role <span className="bif-optional">Optional</span></label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        placeholder="e.g. Software Engineer, Student, Doctor"
                                    />
                                </motion.div>

                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><Smile size={14} /> Current Mood <span className="bif-optional">Optional</span></label>
                                    <input
                                        type="text"
                                        name="mood"
                                        value={formData.mood}
                                        onChange={handleChange}
                                        placeholder="e.g. Tired, Anxious, Motivated"
                                    />
                                </motion.div>

                                <motion.button
                                    type="submit"
                                    className={`bif-btn ${!isStep0Valid ? 'bif-btn--disabled' : ''}`}
                                    variants={itemVariants}
                                    whileHover={isStep0Valid ? { scale: 1.015 } : {}}
                                    whileTap={isStep0Valid ? { scale: 0.985 } : {}}
                                    disabled={!isStep0Valid}
                                >
                                    Continue <ChevronRight size={18} />
                                </motion.button>
                            </form>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial={{ opacity: 0, x: 30 }}
                            animate="visible"
                            exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                        >
                            <motion.h2 variants={itemVariants}>Your Lifestyle</motion.h2>
                            <motion.p className="bif-subtitle" variants={itemVariants}>
                                Helps generate deeper, more relevant questions. All optional.
                            </motion.p>

                            <form onSubmit={handleSubmit}>
                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><Moon size={14} /> Hours of Sleep per Night</label>
                                    <input
                                        type="number"
                                        name="sleepHours"
                                        value={formData.sleepHours}
                                        onChange={handleChange}
                                        placeholder="e.g. 6"
                                        min="1" max="12"
                                    />
                                </motion.div>

                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><Activity size={14} /> Physical Activity Level</label>
                                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                                        <option value="">Select level</option>
                                        {ACTIVITY_LEVELS.map(a => (
                                            <option key={a.value} value={a.value}>{a.label}</option>
                                        ))}
                                    </select>
                                </motion.div>

                                <motion.div className="bif-field" variants={itemVariants}>
                                    <label><MessageSquare size={14} /> What's stressing you most right now? <span className="bif-optional">Optional</span></label>
                                    <input
                                        type="text"
                                        name="stressContext"
                                        value={formData.stressContext}
                                        onChange={handleChange}
                                        placeholder="e.g. Upcoming exams, work deadlines, relationship issues"
                                    />
                                </motion.div>

                                <div className="bif-nav-row">
                                    <motion.button
                                        type="button"
                                        className="bif-back-btn"
                                        onClick={handleBack}
                                        whileHover={{ scale: 1.015 }}
                                        whileTap={{ scale: 0.985 }}
                                    >
                                        <ChevronLeft size={16} /> Back
                                    </motion.button>

                                    <motion.button
                                        type="submit"
                                        className={`bif-btn ${isLoading ? 'bif-btn--loading' : ''}`}
                                        whileHover={!isLoading ? { scale: 1.015 } : {}}
                                        whileTap={!isLoading ? { scale: 0.985 } : {}}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <><Sparkles size={16} className="bif-spin" /> Generating…</>
                                        ) : (
                                            <>Start Assessment <ArrowRight size={18} /></>
                                        )}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default BasicInfoForm;
