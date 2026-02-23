import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Smile, ArrowRight, Sparkles, Globe } from 'lucide-react';
import './BasicInfoForm.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
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
        mood: '',
        language: 'English'
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        onStart(formData);
    };

    return (
        <div className="basic-info-container">
            <motion.div
                className="basic-info-card"
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2 variants={itemVariants}>
                        Tell us about yourself
                    </motion.h2>
                    <motion.p className="subtitle" variants={itemVariants}>
                        This helps our AI craft questions tailored to your life.
                    </motion.p>

                    <form onSubmit={handleSubmit}>
                        <motion.div className="form-group" variants={itemVariants}>
                            <label><Globe size={15} /> Assessment Language</label>
                            <select name="language" value={formData.language} onChange={handleChange} required>
                                <option value="English">English</option>
                                <option value="Hindi">Hindi (हिंदी)</option>
                            </select>
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label><User size={15} /> Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="e.g. 25"
                                required
                                min="10"
                                max="100"
                            />
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label><User size={15} /> Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label><Briefcase size={15} /> Occupation</label>
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                placeholder="e.g. Student, Engineer, Doctor"
                                required
                            />
                        </motion.div>

                        <motion.div className="form-group" variants={itemVariants}>
                            <label><Smile size={15} /> Current Mood <span style={{ opacity: 0.5, fontWeight: 400, fontSize: '0.7rem' }}>(OPTIONAL)</span></label>
                            <input
                                type="text"
                                name="mood"
                                value={formData.mood}
                                onChange={handleChange}
                                placeholder="e.g. Tired, Anxious, Excited"
                            />
                        </motion.div>

                        <motion.button
                            type="submit"
                            className={`start-btn ${isLoading ? 'loading' : ''}`}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Sparkles size={18} className="spin-icon" />
                                    Generating Questions...
                                </>
                            ) : (
                                <>Start Assessment <ArrowRight size={18} /></>
                            )}
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default BasicInfoForm;
