import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(`${firstName} ${lastName}`.trim(), email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error?.message || err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '100px 20px 40px', background: 'transparent' }}>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                    width: '100%',
                    maxWidth: '580px',
                    backgroundColor: 'var(--surface)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '32px',
                    padding: '2.5rem 3.5rem',
                    boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4), 0 0 1px 1px rgba(255,255,255,0.05) inset',
                    position: 'relative',
                    overflow: 'visible'
                }}
            >
                {/* Subtle glow effect behind the box */}
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: '0.4', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '150px', height: '150px', background: 'var(--secondary)', filter: 'blur(80px)', opacity: '0.3', zIndex: -1, pointerEvents: 'none', borderRadius: '50%' }}></div>

                <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '50px', height: '50px', borderRadius: '16px', background: 'var(--gradient-btn)', marginBottom: '1.2rem', boxShadow: '0 10px 25px -5px rgba(167, 139, 250, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Create an Account</h1>
                    <p style={{ color: '#D1D5DB', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Log in</Link>
                    </p>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {error && <div style={{ color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#E5E7EB', fontWeight: '500', marginBottom: '0.5rem', paddingLeft: '0.2rem' }}>First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="John"
                                    className="auth-input"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.1) inset' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#E5E7EB', fontWeight: '500', marginBottom: '0.5rem', paddingLeft: '0.2rem' }}>Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Doe"
                                    className="auth-input"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.1) inset' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#E5E7EB', fontWeight: '500', marginBottom: '0.5rem', paddingLeft: '0.2rem' }}>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="hello@example.com"
                                className="auth-input"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.1) inset' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#E5E7EB', fontWeight: '500', marginBottom: '0.5rem', paddingLeft: '0.2rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength="6"
                                    className="auth-input"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.1) inset' }}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <input type="checkbox" id="terms" required style={{ width: '18px', height: '18px', accentColor: '#7C3AED', cursor: 'pointer' }} />
                            <label htmlFor="terms" style={{ color: '#F3F4F6', fontSize: '0.85rem', cursor: 'pointer' }}>
                                I agree to the <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Terms & Conditions</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn"
                            style={{ width: '100%', padding: '14px', marginTop: '0.5rem', borderRadius: '14px', background: 'var(--gradient-btn)', color: 'white', fontSize: '1rem', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 16px -4px rgba(167, 139, 250, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset' }}
                        >
                            Create Account
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }}></div>
                        <span style={{ padding: '0 1rem', color: '#9CA3AF', fontSize: '0.85rem', fontWeight: '500' }}>Or continue with</span>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            className="social-btn"
                            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            className="social-btn"
                            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.08-.46-2.07-.48-3.2 0-1.14.48-2.1.58-3.04-.31C4.46 16.92 3.1 11.33 6.15 8.16c1.37-1.43 3.01-1.63 4.14-1.68 1.48-.06 2.8.96 3.6 1.05 1.13.12 2.6-1.04 4.24-.9 1.4.08 2.6.61 3.42 1.6-3.01 1.68-2.52 5.61.42 6.84-1.03 2.66-2.58 4.75-4.92 5.21v.01zM11.94 6.32c-.14-2.53 2.06-4.7 4.41-4.82.32 2.68-2.24 4.88-4.41 4.82z" />
                            </svg>
                            Apple
                        </button>
                    </div>
                </div>
            </motion.div>
            <style>{`
                .auth-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
                .auth-input:focus {
                    border-color: var(--primary) !important;
                    background: rgba(0,0,0,0.3) !important;
                }
                .auth-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 20px -4px rgba(109, 40, 217, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset !important;
                }
                .auth-btn:active {
                    transform: translateY(1px);
                    box-shadow: 0 4px 8px -2px rgba(109, 40, 217, 0.4), 0 0 0 1px rgba(255,255,255,0.1) inset !important;
                }
                .social-btn:hover {
                    background: rgba(255,255,255,0.05) !important;
                    border-color: rgba(255,255,255,0.2) !important;
                }
            `}</style>
        </div>
    );
};

export default Register;
