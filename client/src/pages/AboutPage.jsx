import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Shield, Zap, Code, Heart, Sparkles, ArrowRight, Cpu, Database, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHelmet from '../components/SEOHelmet';
import './AboutPage.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const AboutPage = () => {
    const techStack = [
        { icon: Sparkles, name: 'Gemini 3.1 Pro', desc: 'Google\'s most capable reasoning model powering our AI stress analysis engine' },
        { icon: Code, name: 'React', desc: 'Modern component-based frontend with smooth animations via Framer Motion' },
        { icon: Database, name: 'Node.js + MongoDB', desc: 'Secure backend infrastructure for data processing, auth, and analytics' },
        { icon: Shield, name: 'End-to-End Encryption', desc: 'Your data is encrypted in transit and at rest — never shared with third parties' },
    ];

    const howItWorks = [
        { step: '01', title: 'Share Your Profile', desc: 'Tell us about yourself — age, occupation, lifestyle. Takes under 30 seconds.', icon: Globe },
        { step: '02', title: 'AI Generates Questions', desc: 'Gemini 3.1 Pro crafts 10 personalized questions tailored to your specific life context.', icon: Brain },
        { step: '03', title: 'Get Your Analysis', desc: 'Receive a detailed stress score, key stressors, actionable tips, and a personalized wellness plan.', icon: Heart },
    ];

    return (
        <div className="about-page">
            <SEOHelmet
                title="About Comfy — AI Stress Analyzer Powered by Gemini 3.1 Pro"
                description="Learn about Comfy, the AI-powered stress analyzer. Built with Google Gemini 3.1 Pro, React, and Node.js to provide personalized mental wellness assessments."
                url="https://aistressanalyzer.netlify.app/about"
            />
            <Header />

            <main className="about-page-main">
                {/* ── Hero Section ── */}
                <section className="ap-hero">
                    <div className="ap-hero-orb ap-orb-1" />
                    <div className="ap-hero-orb ap-orb-2" />

                    <motion.div className="ap-hero-content" initial="hidden" animate="visible" variants={stagger}>
                        <motion.div className="ap-hero-badge" variants={fadeUp}>
                            <Sparkles size={14} /> About Comfy
                        </motion.div>
                        <motion.h1 className="ap-hero-title" variants={fadeUp}>
                            AI-Powered Stress Analysis,{' '}
                            <span className="ap-gradient-text">Reimagined</span>
                        </motion.h1>
                        <motion.p className="ap-hero-desc" variants={fadeUp}>
                            Comfy uses Google's <strong>Gemini 3.1 Pro</strong> — one of the world's most advanced
                            AI reasoning models — to analyze your stress patterns and deliver deeply personalized
                            mental wellness insights. No generic quizzes. No cookie-cutter advice. Just AI that
                            truly understands your unique life.
                        </motion.p>
                        <motion.div className="ap-hero-cta" variants={fadeUp}>
                            <Link to="/assessment" className="ap-btn-primary">
                                Try Free Assessment <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ── How It Works ── */}
                <section className="ap-section">
                    <motion.div className="ap-section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="ap-section-badge">How It Works</span>
                        <h2 className="ap-section-title">Three steps to understanding your stress</h2>
                        <p className="ap-section-desc">Our AI-driven process takes under 5 minutes and delivers results clinical questionnaires can't match.</p>
                    </motion.div>

                    <motion.div className="ap-steps" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        {howItWorks.map((item, i) => (
                            <motion.div key={i} className="ap-step-card" variants={fadeUp}>
                                <div className="ap-step-number">{item.step}</div>
                                <div className="ap-step-icon">
                                    <item.icon size={28} />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                {i < howItWorks.length - 1 && <div className="ap-step-connector" />}
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── Technology ── */}
                <section className="ap-section ap-tech-section">
                    <motion.div className="ap-section-header" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <span className="ap-section-badge"><Cpu size={14} /> Technology</span>
                        <h2 className="ap-section-title">Built with the best in AI</h2>
                        <p className="ap-section-desc">
                            Comfy is powered by <strong>Google Gemini 3.1 Pro</strong>, the latest frontier AI model with
                            advanced reasoning, nuanced understanding, and multi-turn conversation capabilities.
                        </p>
                    </motion.div>

                    <motion.div className="ap-tech-grid" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
                        {techStack.map((tech, i) => (
                            <motion.div key={i} className="ap-tech-card" variants={fadeUp}>
                                <div className="ap-tech-icon">
                                    <tech.icon size={24} />
                                </div>
                                <h3>{tech.name}</h3>
                                <p>{tech.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* ── Mission ── */}
                <section className="ap-section ap-mission-section">
                    <motion.div className="ap-mission-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <div className="ap-mission-icon"><Heart size={32} /></div>
                        <h2>Our Mission</h2>
                        <p>
                            Mental wellness shouldn't be a luxury. Comfy was built to make AI-powered stress
                            assessment accessible to everyone — students, professionals, homemakers, and everyone
                            in between. We believe that understanding your stress is the first step to managing it,
                            and with the power of Gemini 3.1 Pro, we're making that understanding deeper and more
                            personal than ever before.
                        </p>
                        <div className="ap-mission-disclaimer">
                            <Shield size={16} />
                            <span>Comfy is an awareness tool — not a replacement for professional mental health care.</span>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
