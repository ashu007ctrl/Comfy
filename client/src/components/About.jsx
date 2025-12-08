import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Zap } from 'lucide-react';
import './About.css';

const About = () => {
    const features = [
        {
            icon: Heart,
            title: 'Personalized Care',
            text: 'Tailored insights and recommendations based on your unique stress profile and responses.'
        },
        {
            icon: ShieldCheck,
            title: '100% Private',
            text: 'Your data is encrypted and processed securely. We never share your information.'
        },
        {
            icon: Zap,
            title: 'Instant Results',
            text: 'Get your detailed stress score and actionable tips immediately after completing the test.'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
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
                    <div className="about-badge">Why Choose Us</div>
                    <h2 className="about-title">Advanced AI-Powered Stress Detection</h2>
                    <p className="about-description">
                        Comfy uses cutting-edge artificial intelligence to analyze your responses and provide
                        accurate stress assessments. Our mission is to make mental health tracking simple,
                        private, and accessible to everyone.
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
