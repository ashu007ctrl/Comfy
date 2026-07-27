import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Mail, MessageSquare, HelpCircle, ChevronDown } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHelmet from '../components/SEOHelmet';
import './ContactPage.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const FAQ_ITEMS = [
    { q: 'Is Comfy free to use?', a: 'Yes, Comfy is completely free. You can take the AI stress assessment, view your results, and receive personalized recommendations without any cost.' },
    { q: 'How accurate is the AI stress analysis?', a: 'Comfy uses Google Gemini 3.1 Pro for highly personalized analysis based on validated psychological frameworks. It provides meaningful insights, but it is not a clinical diagnostic tool.' },
    { q: 'Is my data private and secure?', a: 'Absolutely. Your assessment data is encrypted and processed securely. We never share your personal information or stress analysis results with third parties.' },
    { q: 'Can Comfy detect burnout?', a: 'Yes. Comfy\'s AI analyzes factors like emotional exhaustion, reduced productivity, and chronic fatigue to help detect burnout alongside general stress levels.' },
    { q: 'Does Comfy replace professional therapy?', a: 'No. Comfy is a self-assessment and awareness tool. It provides valuable insights but is not a substitute for professional mental health care. If you\'re experiencing severe stress, please consult a licensed professional.' },
];

const ContactPage = () => {
    const [status, setStatus] = useState('idle');
    const [openFaq, setOpenFaq] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        const ACCESS_KEY = "dae471c1-c8c4-48c5-a9df-cdd2c69150ca";
        const formData = new FormData(e.target);
        formData.append("access_key", ACCESS_KEY);

        try {
            const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
            const data = await res.json();
            if (data.success) {
                setStatus('success');
                e.target.reset();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="contact-page">
            <SEOHelmet
                title="Contact Us — Comfy AI Stress Analyzer"
                description="Have questions about Comfy? Get in touch with our team for support, feedback, or partnership inquiries."
                url="https://aistressanalyzer.netlify.app/contact"
            />
            <Header />

            <main className="cp-main">
                {/* ── Hero ── */}
                <section className="cp-hero">
                    <div className="cp-hero-orb cp-orb-1" />
                    <div className="cp-hero-orb cp-orb-2" />
                    <motion.div className="cp-hero-content" initial="hidden" animate="visible" variants={stagger}>
                        <motion.div className="cp-hero-badge" variants={fadeUp}>
                            <Mail size={14} /> Get in Touch
                        </motion.div>
                        <motion.h1 className="cp-hero-title" variants={fadeUp}>
                            We'd love to hear from you
                        </motion.h1>
                        <motion.p className="cp-hero-desc" variants={fadeUp}>
                            Have feedback on your stress assessment, feature requests, or partnership ideas? Drop us a message.
                        </motion.p>
                    </motion.div>
                </section>

                <div className="cp-content">
                    {/* ── Contact Form ── */}
                    <motion.div className="cp-form-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        {status === 'success' ? (
                            <div className="cp-success">
                                <motion.div className="cp-success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                                    <CheckCircle size={48} />
                                </motion.div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                                <button className="cp-btn-secondary" onClick={() => setStatus('idle')}>Send Another</button>
                            </div>
                        ) : (
                            <>
                                <div className="cp-form-header">
                                    <MessageSquare size={20} />
                                    <h2>Send a Message</h2>
                                </div>
                                <form onSubmit={handleSubmit} className="cp-form">
                                    <div className="cp-field-row">
                                        <div className="cp-field">
                                            <label>Your Name</label>
                                            <input type="text" name="name" placeholder="John Doe" required />
                                        </div>
                                        <div className="cp-field">
                                            <label>Your Email</label>
                                            <input type="email" name="email" placeholder="john@example.com" required />
                                        </div>
                                    </div>
                                    <div className="cp-field">
                                        <label>Message</label>
                                        <textarea name="message" placeholder="What's on your mind?" required rows={5} />
                                    </div>
                                    {status === 'error' && (
                                        <motion.p className="cp-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            Something went wrong. Please try again.
                                        </motion.p>
                                    )}
                                    <motion.button
                                        type="submit"
                                        className="cp-submit-btn"
                                        disabled={status === 'submitting'}
                                        whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
                                        whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
                                    >
                                        {status === 'submitting' ? 'Sending…' : 'Send Message'}
                                        {status !== 'submitting' && <Send size={18} />}
                                    </motion.button>
                                    <input type="hidden" name="subject" value="New Submission from Comfy Website" />
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* ── FAQ Section ── */}
                    <motion.div className="cp-faq-section" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.div className="cp-faq-header" variants={fadeUp}>
                            <HelpCircle size={20} />
                            <h2>Frequently Asked Questions</h2>
                        </motion.div>
                        <div className="cp-faq-list">
                            {FAQ_ITEMS.map((item, i) => (
                                <motion.div key={i} className={`cp-faq-item ${openFaq === i ? 'open' : ''}`} variants={fadeUp}>
                                    <button className="cp-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span>{item.q}</span>
                                        <ChevronDown size={18} className="cp-faq-chevron" />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                className="cp-faq-answer"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            >
                                                <p>{item.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
