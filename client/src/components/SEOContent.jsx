import React from 'react';
import { motion } from 'framer-motion';
import {
    Brain,
    ClipboardCheck,
    BarChart3,
    Lightbulb,
    GraduationCap,
    Briefcase,
    Users,
    Shield,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import './SEOContent.css';

const SEOContent = ({ onStart }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <section className="seo-content-section" aria-label="About Comfy AI Stress Analyzer">
            <div className="seo-content-container">

                {/* Section 1: What is Comfy */}
                <motion.div
                    className="seo-block"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    <motion.div className="seo-block-header" variants={itemVariants}>
                        <div className="seo-icon-wrapper">
                            <Brain size={28} />
                        </div>
                        <h2>What Is Comfy — Your AI Stress Analyzer</h2>
                    </motion.div>
                    <motion.div className="seo-block-body" variants={itemVariants}>
                        <p>
                            Comfy is a free, AI-powered stress analyzer designed to help you understand your stress
                            levels through intelligent analysis. Built on Google Gemini AI, Comfy goes beyond basic
                            online stress tests by providing deeply personalized insights tailored to your unique
                            emotional, physical, and psychological state.
                        </p>
                        <p>
                            Unlike traditional questionnaires that simply assign a number, Comfy's AI stress detection
                            engine evaluates the nuances in your responses — identifying specific stressors, recognizing
                            burnout patterns, and generating actionable wellness recommendations that actually help.
                            Whether you're a student overwhelmed by exams, a professional facing workplace burnout, or
                            anyone seeking clarity on their mental health, Comfy is your companion for understanding and
                            managing stress.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Section 2: How It Works */}
                <motion.div
                    className="seo-block"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    <motion.div className="seo-block-header" variants={itemVariants}>
                        <div className="seo-icon-wrapper">
                            <ClipboardCheck size={28} />
                        </div>
                        <h2>How Our AI Stress Detection Works</h2>
                    </motion.div>
                    <motion.div className="seo-block-body" variants={itemVariants}>
                        <div className="seo-steps">
                            <div className="seo-step">
                                <div className="seo-step-number">1</div>
                                <div className="seo-step-content">
                                    <h3>Take the Assessment</h3>
                                    <p>
                                        Answer a scientifically designed questionnaire covering your emotional
                                        well-being, sleep quality, work-life balance, and daily stress triggers.
                                        The assessment takes approximately five minutes to complete.
                                    </p>
                                </div>
                            </div>
                            <div className="seo-step">
                                <div className="seo-step-number">2</div>
                                <div className="seo-step-content">
                                    <h3>AI Analysis by Gemini</h3>
                                    <p>
                                        Your responses are processed by Google Gemini AI, which uses advanced natural
                                        language understanding to analyze stress indicators, detect anxiety patterns,
                                        and evaluate burnout risk factors specific to your situation.
                                    </p>
                                </div>
                            </div>
                            <div className="seo-step">
                                <div className="seo-step-number">3</div>
                                <div className="seo-step-content">
                                    <h3>Get Personalized Insights</h3>
                                    <p>
                                        Receive a comprehensive stress score along with detailed, personalized
                                        recommendations including lifestyle adjustments,
                                        mindfulness strategies, and targeted tips to help you improve your mental
                                        wellness over time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Section 3: Features */}
                <motion.div
                    className="seo-block"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    <motion.div className="seo-block-header" variants={itemVariants}>
                        <div className="seo-icon-wrapper">
                            <BarChart3 size={28} />
                        </div>
                        <h2>Free Online AI Stress Assessment Features</h2>
                    </motion.div>
                    <motion.div className="seo-block-body" variants={itemVariants}>
                        <div className="seo-features-grid">
                            <div className="seo-feature-item">
                                <Sparkles size={20} className="seo-feature-icon" />
                                <div>
                                    <strong>AI-Powered Analysis</strong>
                                    <p>Google Gemini AI delivers human-like understanding of your stress patterns, going far beyond simple scoring algorithms.</p>
                                </div>
                            </div>
                            <div className="seo-feature-item">
                                <Shield size={20} className="seo-feature-icon" />
                                <div>
                                    <strong>Private & Encrypted</strong>
                                    <p>Your assessment data is fully encrypted. No data sharing, no selling — your mental health information stays yours.</p>
                                </div>
                            </div>
                            <div className="seo-feature-item">
                                <BarChart3 size={20} className="seo-feature-icon" />
                                <div>
                                    <strong>Stress History Dashboard</strong>
                                    <p>Track your stress levels over time with a personal dashboard that visualizes trends and helps you see what's working.</p>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </motion.div>

                {/* Section 4: Who It's For */}
                <motion.div
                    className="seo-block"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    <motion.div className="seo-block-header" variants={itemVariants}>
                        <div className="seo-icon-wrapper">
                            <Users size={28} />
                        </div>
                        <h2>Who Can Benefit from Comfy's Stress Analysis</h2>
                    </motion.div>
                    <motion.div className="seo-block-body" variants={itemVariants}>
                        <div className="seo-audience-grid">
                            <div className="seo-audience-card">
                                <GraduationCap size={24} className="seo-audience-icon" />
                                <h3>Students & Academics</h3>
                                <p>
                                    College stress, exam anxiety, and academic pressure are real challenges.
                                    Comfy helps students identify stress triggers, manage study-related anxiety,
                                    and build resilience during demanding academic periods.
                                </p>
                            </div>
                            <div className="seo-audience-card">
                                <Briefcase size={24} className="seo-audience-icon" />
                                <h3>Working Professionals</h3>
                                <p>
                                    From deadline pressures to workplace burnout, professionals face unique
                                    stress challenges. Comfy's AI detects early signs of burnout and provides
                                    targeted strategies for maintaining work-life balance and productivity.
                                </p>
                            </div>
                            <div className="seo-audience-card">
                                <Users size={24} className="seo-audience-icon" />
                                <h3>Anyone Seeking Wellness</h3>
                                <p>
                                    You don't need to be "stressed out" to benefit. Comfy is for anyone
                                    curious about their mental wellness, looking to build healthier habits,
                                    or wanting to proactively manage their emotional well-being.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Section 5: Science Behind It */}
                <motion.div
                    className="seo-block"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    <motion.div className="seo-block-header" variants={itemVariants}>
                        <div className="seo-icon-wrapper">
                            <Lightbulb size={28} />
                        </div>
                        <h2>The Science Behind AI Mental Health Assessment</h2>
                    </motion.div>
                    <motion.div className="seo-block-body" variants={itemVariants}>
                        <p>
                            Mental health assessment has evolved significantly with the advancement of artificial
                            intelligence. Comfy leverages Google Gemini AI — one of the most capable large language
                            models available — to understand the context and subtlety behind your responses.
                        </p>
                        <p>
                            Traditional stress questionnaires rely on rigid scoring frameworks that miss individual
                            nuances. Comfy's approach is different: our AI considers the interplay between your
                            emotional state, physical symptoms, lifestyle factors, and environmental stressors to
                            produce a holistic stress assessment. The result is a comprehensive analysis that
                            recognizes you as a whole person, not just a set of numbers.
                        </p>
                        <p>
                            Our assessment framework draws from established psychological models for stress evaluation
                            while enhancing them with AI's ability to identify patterns that conventional tools may
                            overlook. This fusion of evidence-based psychology and cutting-edge AI technology makes
                            Comfy one of the most thoughtful online stress analysis tools available today.
                        </p>
                    </motion.div>
                </motion.div>

                {/* Section 6: CTA */}
                <motion.div
                    className="seo-block seo-cta-block"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={containerVariants}
                >
                    <motion.div className="seo-cta-content" variants={itemVariants}>
                        <h2>Start Your Free AI Stress Test Today</h2>
                        <p>
                            Join thousands of users who have already discovered their stress patterns with
                            Comfy. Our AI stress analyzer is completely free, takes only five minutes, and
                            provides instant personalized results. No sign-up required to begin.
                        </p>
                        {onStart && (
                            <motion.button
                                className="seo-cta-button"
                                onClick={onStart}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                aria-label="Take free AI stress test now"
                            >
                                Take the Free Stress Test
                                <ArrowRight size={20} />
                            </motion.button>
                        )}
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default SEOContent;
