import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import './About.css';

const About = () => {
    const features = [
        {
            icon: Sparkles,
            title: 'Gemini 3.1 Pro AI',
            text: 'Powered by Google\'s latest frontier model — Gemini 3.1 Pro delivers deeply personalized stress analysis with advanced reasoning capabilities.'
        },
        {
            icon: Heart,
            title: 'Personalized Care',
            text: 'Tailored stress insights and wellness recommendations based on your unique stress profile, lifestyle, and emotional responses.'
        },
        {
            icon: ShieldCheck,
            title: '100% Private & Secure',
            text: 'Your stress assessment data is encrypted and processed securely. Comfy never shares your personal information with third parties.'
        },
        {
            icon: Zap,
            title: 'Instant AI Results',
            text: 'Receive your detailed AI stress analysis score and actionable mental wellness tips immediately after completing the assessment.'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <section id="about" className="about-section">
            {/* Background Decorations */}
            <div className="about-bg-decorations">
                <div className="about-blob about-blob-1"></div>
                <div className="about-blob about-blob-2"></div>
            </div>

            <div className="container about-container">
                {/* Header */}
                <motion.div
                    className="about-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="about-badge">Why Choose Comfy</div>
                    <h2 className="about-title">AI Stress Analysis Powered by Gemini 3.1 Pro</h2>
                    <p className="about-description">
                        Comfy uses Google's <strong>Gemini 3.1 Pro</strong> — one of the world's most advanced AI reasoning
                        models — to analyze your responses and deliver deeply personalized stress insights. Whether you're
                        dealing with work stress, academic pressure, or everyday anxiety, our AI provides tailored
                        recommendations to help you understand and manage your mental wellness effectively.
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                    className="about-features"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="about-feature-card"
                            variants={cardVariants}
                        >
                            <div className="about-feature-icon">
                                <feature.icon size={36} color="white" />
                            </div>
                            <h3 className="about-feature-title">{feature.title}</h3>
                            <p className="about-feature-text">{feature.text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default About;
