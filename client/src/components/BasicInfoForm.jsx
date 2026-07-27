import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, ArrowRight, Sparkles, Globe, Moon, Activity, MessageSquare } from 'lucide-react';
import './BasicInfoForm.css';

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
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
};

const BasicInfoForm = ({ onStart }) => {
    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        occupation: '',
        occupationType: '',
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

    const isFormValid = formData.age && formData.gender && formData.occupationType;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setIsLoading(true);
        // Map occupationType to occupation for backend compatibility
        const occupationLabel = OCCUPATION_TYPES.find(o => o.value === formData.occupationType)?.label || formData.occupationType;
        onStart({ ...formData, occupation: occupationLabel });
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

                {/* Header */}
                <motion.div className="bif-header" variants={containerVariants} initial="hidden" animate="visible">
                    <motion.div className="bif-ai-badge" variants={itemVariants}>
                        <Sparkles size={14} />
                        Powered by Gemini 3.1 Pro
                    </motion.div>
                    <motion.h2 variants={itemVariants}>Let's personalize your assessment</motion.h2>
                    <motion.p className="bif-subtitle" variants={itemVariants}>
                        Share a few details so our AI can craft questions tailored to your life.
                    </motion.p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <motion.div className="bif-form-grid" variants={containerVariants} initial="hidden" animate="visible">

                        {/* Section: Basic Info */}
                        <motion.div className="bif-section-label" variants={itemVariants}>
                            <User size={15} />
                            <span>Basic Info</span>
                        </motion.div>

                        <motion.div className="bif-field-row" variants={itemVariants}>
                            <div className="bif-field">
                                <label><Globe size={14} /> Language</label>
                                <select name="language" value={formData.language} onChange={handleChange} required>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi (हिंदी)</option>
                                </select>
                            </div>
                            <div className="bif-field">
                                <label><User size={14} /> Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="e.g. 24"
                                    required min="10" max="100"
                                />
                            </div>
                        </motion.div>

                        <motion.div className="bif-field-row" variants={itemVariants}>
                            <div className="bif-field">
                                <label><User size={14} /> Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Prefer not to say">Prefer not to say</option>
                                </select>
                            </div>
                            <div className="bif-field">
                                <label><Briefcase size={14} /> Occupation</label>
                                <select name="occupationType" value={formData.occupationType} onChange={handleChange} required>
                                    <option value="">Select type</option>
                                    {OCCUPATION_TYPES.map(o => (
                                        <option key={o.value} value={o.value}>{o.label}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>

                        {/* Section: Lifestyle */}
                        <motion.div className="bif-section-label bif-section-lifestyle" variants={itemVariants}>
                            <Moon size={15} />
                            <span>Lifestyle</span>
                        </motion.div>

                        <motion.div className="bif-field-row" variants={itemVariants}>
                            <div className="bif-field">
                                <label><Moon size={14} /> Sleep Hours / Night</label>
                                <input
                                    type="number"
                                    name="sleepHours"
                                    value={formData.sleepHours}
                                    onChange={handleChange}
                                    placeholder="e.g. 6"
                                    min="1" max="14"
                                />
                            </div>
                            <div className="bif-field">
                                <label><Activity size={14} /> Physical Activity <span className="bif-optional">Optional</span></label>
                                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange}>
                                    <option value="">Select level</option>
                                    {ACTIVITY_LEVELS.map(a => (
                                        <option key={a.value} value={a.value}>{a.label}</option>
                                    ))}
                                </select>
                            </div>
                        </motion.div>

                        <motion.div className="bif-field bif-field-full" variants={itemVariants}>
                            <label><MessageSquare size={14} /> What's stressing you most right now? <span className="bif-optional">Optional</span></label>
                            <input
                                type="text"
                                name="stressContext"
                                value={formData.stressContext}
                                onChange={handleChange}
                                placeholder="e.g. Upcoming exams, work deadlines, relationship issues"
                            />
                        </motion.div>

                    </motion.div>

                    {/* Submit */}
                    <motion.div className="bif-submit-wrap" variants={itemVariants} initial="hidden" animate="visible">
                        <motion.button
                            type="submit"
                            className={`bif-btn ${!isFormValid ? 'bif-btn--disabled' : ''} ${isLoading ? 'bif-btn--loading' : ''}`}
                            whileHover={isFormValid && !isLoading ? { scale: 1.015 } : {}}
                            whileTap={isFormValid && !isLoading ? { scale: 0.985 } : {}}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? (
                                <><Sparkles size={18} className="bif-spin" /> Generating Questions…</>
                            ) : (
                                <>Start Assessment <ArrowRight size={18} /></>
                            )}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default BasicInfoForm;
