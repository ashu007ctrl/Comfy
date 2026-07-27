import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '3rem 0 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div className="container" style={{
                maxWidth: '1100px',
                margin: '0 auto',
                padding: '0 1.5rem'
            }}>
                {/* Top Section */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2.5rem',
                    justifyContent: 'space-between',
                    marginBottom: '2rem'
                }}>
                    {/* Brand */}
                    <div style={{ maxWidth: '340px' }}>
                        <div style={{
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            color: '#fff',
                            marginBottom: '0.5rem'
                        }}>
                            Comfy
                        </div>
                        <p style={{
                            fontSize: '0.88rem',
                            lineHeight: '1.6',
                            color: 'rgba(255, 255, 255, 0.6)',
                            margin: 0
                        }}>
                            Comfy is a free AI stress analyzer that helps you assess your stress levels,
                            detect burnout, and receive personalized mental wellness insights — powered
                            by Google Gemini 3.1 Pro.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Quick Links
                        </div>
                        <nav aria-label="Footer navigation">
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                {[
                                    { label: 'Home', to: '/' },
                                    { label: 'Take Stress Test', to: '/assessment' },
                                    { label: 'About', to: '/about' },
                                    { label: 'Contact', to: '/contact' },
                                ].map((link) => (
                                    <li key={link.to}>
                                        <Link
                                            to={link.to}
                                            style={{
                                                color: 'rgba(255, 255, 255, 0.55)',
                                                textDecoration: 'none',
                                                fontSize: '0.88rem',
                                                transition: 'color 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                                            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.55)'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Legal */}
                    <div>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Legal
                        </div>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            {[
                                { label: 'Terms & Conditions', to: '/terms' },
                                { label: 'Privacy Policy', to: '/terms#privacy' },
                                { label: 'AI Usage Policy', to: '/terms#ai' },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        style={{
                                            color: 'rgba(255, 255, 255, 0.55)',
                                            textDecoration: 'none',
                                            fontSize: '0.88rem',
                                            transition: 'color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                                        onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.55)'}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/login"
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.55)',
                                        textDecoration: 'none',
                                        fontSize: '0.88rem',
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = '#a78bfa'}
                                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.55)'}
                                >
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    margin: '0 0 1.2rem'
                }} />

                {/* Bottom */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.8rem'
                }}>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                        © {currentYear} Comfy — AI Stress Analyzer. Powered by Google Gemini 3.1 Pro.
                    </p>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.35)' }}>
                        Not a substitute for professional medical advice.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
