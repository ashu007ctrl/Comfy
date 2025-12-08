import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Mail, User, MessageSquare } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        const ACCESS_KEY = "dae471c1-c8c4-48c5-a9df-cdd2c69150ca";
        const formData = new FormData(e.target);
        formData.append("access_key", ACCESS_KEY);

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
                e.target.reset();
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="contact-section">
            {/* Background Decorations */}
            <div className="contact-bg-decorations">
                <div className="contact-blob contact-blob-1"></div>
                <div className="contact-blob contact-blob-2"></div>
            </div>

            <div className="container contact-container">
                <motion.div
                    className="contact-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {status === 'success' ? (
                        <div className="contact-success">
                            <motion.div
                                className="contact-success-icon"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <CheckCircle size={48} color="white" />
                            </motion.div>
                            <h3 className="contact-success-title">Message Sent!</h3>
                            <p className="contact-success-text">
                                Thank you for reaching out. We'll get back to you as soon as possible.
                            </p>
                            <button
                                className="contact-btn-secondary"
                                onClick={() => setStatus('idle')}
                            >
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="contact-header">
                                <h2 className="contact-title">Get in Touch</h2>
                                <p className="contact-description">
                                    Have questions or feedback? We'd love to hear from you.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="contact-input-wrapper">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        required
                                        className="contact-input"
                                    />
                                </div>

                                <div className="contact-input-wrapper">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        required
                                        className="contact-input"
                                    />
                                </div>

                                <div className="contact-input-wrapper">
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        required
                                        className="contact-textarea"
                                    />
                                </div>

                                {status === 'error' && (
                                    <motion.div
                                        className="contact-error-message"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        Something went wrong. Please try again.
                                    </motion.div>
                                )}

                                <motion.button
                                    type="submit"
                                    className="contact-submit-btn"
                                    disabled={status === 'submitting'}
                                    whileHover={{ scale: status === 'submitting' ? 1 : 1.02 }}
                                    whileTap={{ scale: status === 'submitting' ? 1 : 0.98 }}
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    {status !== 'submitting' && <Send size={20} />}
                                </motion.button>

                                <input type="hidden" name="subject" value="New Submission from Comfy Website" />
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
