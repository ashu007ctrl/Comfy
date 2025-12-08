import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Hero.css';
import heroImage from '../assets/hero-meditation.png';

const Hero = ({ onStart }) => {
    return (
        <section className="hero-section">
            {/* Animated Background Decorations */}
            <div className="hero-bg-decorations">
                <div className="hero-blob hero-blob-1"></div>
                <div className="hero-blob hero-blob-2"></div>
                <div className="hero-blob hero-blob-3"></div>
            </div>

            <div className="container hero-container">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <div className="hero-badge">
                            <div className="hero-badge-pulse"></div>
                            AI-Powered Stress Detection
                        </div>

                        {/* Main Title */}
                        <h1 className="hero-title">
                            Understand Your Stress, Improve Your Life
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-subtitle">
                            Get personalized insights with our advanced AI stress assessment.
                            Discover your stress levels and receive actionable tips in minutes.
                        </p>

                        {/* CTA Buttons */}
                        <div className="hero-cta-group">
                            <motion.button
                                className="hero-btn-primary"
                                onClick={onStart}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start Free Test
                                <ArrowRight size={20} />
                            </motion.button>
                            <motion.button
                                className="hero-btn-secondary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Learn More
                            </motion.button>
                        </div>

                        {/* Stats */}
                        <motion.div
                            className="hero-stats"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            <div className="hero-stat-item">
                                <div className="hero-stat-number">10k+</div>
                                <div className="hero-stat-label">Users Tested</div>
                            </div>
                            <div className="hero-stat-item">
                                <div className="hero-stat-number">95%</div>
                                <div className="hero-stat-label">Accuracy</div>
                            </div>
                            <div className="hero-stat-item">
                                <div className="hero-stat-number">5min</div>
                                <div className="hero-stat-label">Quick Test</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Image */}
                <div className="hero-image-wrapper">
                    <div className="hero-image-bg"></div>
                    <motion.img
                        src={heroImage}
                        alt="Meditation Illustration"
                        className="hero-image"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    />
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                className="scroll-down-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
