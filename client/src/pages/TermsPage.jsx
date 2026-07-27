import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Database, Brain, AlertTriangle, Scale } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHelmet from '../components/SEOHelmet';
import './TermsPage.css';

const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const sections = [
    {
        id: 'terms',
        icon: FileText,
        title: 'Terms of Use',
        content: [
            'By accessing and using Comfy ("the Service"), you agree to comply with these Terms & Conditions. If you do not agree, please discontinue use of the Service.',
            'Comfy is provided as a free, AI-powered stress assessment tool for educational and personal awareness purposes. You must be at least 13 years old to use this Service.',
            'You agree to provide accurate information during assessments and not to misuse the Service for any harmful or illegal purposes.',
            'We reserve the right to modify these terms at any time. Continued use constitutes acceptance of any updates.',
        ]
    },
    {
        id: 'privacy',
        icon: Shield,
        title: 'Privacy Policy',
        content: [
            'Your privacy is important to us. Comfy collects minimal personal data — limited to assessment responses, basic profile information (age, gender, occupation type), and account credentials if you choose to register.',
            'We do not sell, share, or disclose your personal data to third parties for marketing or commercial purposes.',
            'Assessment data is processed server-side to generate your stress analysis and is encrypted both in transit (TLS/SSL) and at rest.',
            'You may delete your account and all associated data at any time by contacting us through the Contact page.',
        ]
    },
    {
        id: 'data',
        icon: Database,
        title: 'Data Collection & Storage',
        content: [
            'Comfy stores your assessment results to enable the stress history and dashboard features. This data is hosted on secure cloud infrastructure.',
            'We use cookies only for session management and authentication (HTTP-only cookies). We do not use tracking cookies or third-party analytics trackers.',
            'Contact form submissions are processed through Web3Forms and are subject to their privacy policy.',
            'We retain your data for as long as your account exists. Anonymous, aggregated data may be retained for service improvement.',
        ]
    },
    {
        id: 'ai',
        icon: Brain,
        title: 'AI Usage & Technology',
        content: [
            'Comfy uses Google Gemini 3.1 Pro, a large language model by Google DeepMind, to generate personalized stress assessment questions and analyze your responses.',
            'Your assessment data is sent to the Google Generative AI API for processing. Google\'s API usage policies apply to this data transmission. We do not store your data on Google\'s servers beyond the API call duration.',
            'AI-generated results are for informational purposes only. They should not be interpreted as medical, psychological, or clinical advice.',
            'The AI model may produce varied responses across sessions. This is by design to avoid repetitive assessments and ensure personalized results.',
        ]
    },
    {
        id: 'disclaimer',
        icon: AlertTriangle,
        title: 'Medical Disclaimer',
        content: [
            'Comfy is NOT a medical device, diagnostic tool, or substitute for professional mental health care. It is designed solely as a personal awareness and educational tool.',
            'The stress scores, analysis, and recommendations provided by Comfy should not be used to diagnose, treat, or manage any medical or psychological condition.',
            'If you are experiencing severe stress, anxiety, depression, or any mental health crisis, please seek help from a licensed healthcare professional or contact a crisis helpline immediately.',
            'Comfy and its creators are not liable for any decisions made based on the information provided by the Service.',
        ]
    },
    {
        id: 'liability',
        icon: Scale,
        title: 'Limitation of Liability',
        content: [
            'The Service is provided "as is" without warranties of any kind, either express or implied, including but not limited to accuracy, completeness, or fitness for a particular purpose.',
            'In no event shall Comfy, its developers, or affiliates be liable for any indirect, incidental, or consequential damages arising from the use of the Service.',
            'We do not guarantee uninterrupted or error-free operation of the Service.',
        ]
    },
];

const TermsPage = () => {
    const lastUpdated = 'July 27, 2026';

    return (
        <div className="terms-page">
            <SEOHelmet
                title="Terms & Conditions — Comfy AI Stress Analyzer"
                description="Read the terms of use, privacy policy, and AI usage disclaimer for Comfy, the AI-powered stress analyzer."
                url="https://aistressanalyzer.netlify.app/terms"
            />
            <Header />

            <main className="tp-main">
                {/* ── Hero ── */}
                <section className="tp-hero">
                    <motion.div className="tp-hero-content" initial="hidden" animate="visible" variants={stagger}>
                        <motion.div className="tp-hero-badge" variants={fadeUp}>
                            <Shield size={14} /> Legal
                        </motion.div>
                        <motion.h1 className="tp-hero-title" variants={fadeUp}>Terms & Conditions</motion.h1>
                        <motion.p className="tp-hero-desc" variants={fadeUp}>
                            Last updated: {lastUpdated}
                        </motion.p>
                    </motion.div>
                </section>

                {/* ── Quick Nav ── */}
                <nav className="tp-nav">
                    {sections.map(s => (
                        <a key={s.id} href={`#${s.id}`} className="tp-nav-link">
                            <s.icon size={14} />
                            {s.title}
                        </a>
                    ))}
                </nav>

                {/* ── Content Sections ── */}
                <div className="tp-content">
                    {sections.map((section, i) => (
                        <motion.section
                            key={section.id}
                            id={section.id}
                            className="tp-section"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                            variants={fadeUp}
                        >
                            <div className="tp-section-header">
                                <div className="tp-section-icon">
                                    <section.icon size={20} />
                                </div>
                                <h2>{section.title}</h2>
                            </div>
                            <div className="tp-section-body">
                                {section.content.map((para, j) => (
                                    <p key={j}>{para}</p>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TermsPage;
