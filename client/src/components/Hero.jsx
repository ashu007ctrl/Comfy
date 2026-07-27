import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Hero.css';
import heroImageWebp from '../assets/hero-meditation.webp';
import heroImagePng from '../assets/hero-meditation.png';
import geminiLogo from '../assets/gemini-logo11.png';

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
                            <img
                                src={geminiLogo}
                                alt="Google Gemini AI logo powering Comfy stress analysis"
                                className="gemini-logo"
                            />
                            AI-Powered by Gemini 3.1 Pro
                        </div>

                        {/* Main Title — SEO H1 with brand + primary keyword */}
                        <h1 className="hero-title">
                            Comfy – AI Stress Analyzer
                        </h1>

                        {/* Subtitle with natural keyword inclusion */}
                        <p className="hero-subtitle">
                            Analyze your stress levels with AI-powered precision. Get personalized
                            mental wellness insights, detect burnout early, and take a free online
                            stress test — all in under 5 minutes.
                        </p>

                        {/* CTA Buttons */}
                        <div className="hero-cta-group">
                            <motion.button
                                className="hero-btn-primary"
                                onClick={onStart}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                aria-label="Start free AI stress test"
                            >
                                Start Free Test
                                <ArrowRight size={20} />
                            </motion.button>
                            <motion.button
                                className="hero-btn-secondary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                aria-label="Learn more about Comfy AI stress analysis"
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

                {/* Right Image — WebP with PNG fallback, SEO-optimized alt text */}
                <div className="hero-image-wrapper">
                    <div className="hero-image-bg"></div>
                    <motion.picture
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <source srcSet={heroImageWebp} type="image/webp" />
                        <img
                            src={heroImagePng}
                            alt="Comfy AI Stress Analyzer — meditation and mental wellness illustration"
                            className="hero-image"
                            loading="eager"
                            width="500"
                            height="500"
                        />
                    </motion.picture>
                </div>
            </div>

        </section>
    );
};

export default Hero;
