import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            if (!isHomePage) return;
            const sections = ['home', 'about', 'contact'];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= -100 && rect.top < 300) {
                        setActiveSection(section);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        setIsMobileMenuOpen(false);
        await logout();
        navigate('/');
    };

    const scrollTo = (id) => {
        setIsMobileMenuOpen(false);
        if (!isHomePage) {
            navigate(`/#${id}`);
        } else {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const showWhite = !isHomePage || scrolled;

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                padding: showWhite ? '12px 0' : '18px 0',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                background: showWhite ? 'rgba(11, 10, 16, 0.8)' : 'transparent',
                backdropFilter: showWhite ? 'blur(20px)' : 'none',
                WebkitBackdropFilter: showWhite ? 'blur(20px)' : 'none',
                boxShadow: showWhite ? '0 4px 30px rgba(0, 0, 0, 0.5)' : 'none',
                borderBottom: showWhite ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            }}
        >
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 1.5rem',
                border: 'none', background: 'none'
            }}>
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                        fontSize: '1.6rem',
                        fontWeight: '700',
                        letterSpacing: '-0.03em',
                        color: '#ffffffff',

                        cursor: 'pointer',
                    }}

                    onClick={() => {
                        navigate('/');
                        setIsMobileMenuOpen(false);
                    }}
                >
                    Comfy
                </motion.div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ marginLeft: 'auto', zIndex: 1001, position: isMobileMenuOpen ? 'fixed' : 'relative', right: isMobileMenuOpen ? '24px' : '0' }}
                >
                    {isMobileMenuOpen ? <X size={28} color="var(--text-primary)" /> : <Menu size={28} color={showWhite ? "var(--text-primary)" : "var(--primary)"} />}
                </button>

                {/* Navigation Overlay Background for Mobile */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                background: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 998
                            }}
                            className="mobile-overlay" /* Optional hide on desktop via CSS if needed, but display flex handles it mostly */
                        />
                    )}
                </AnimatePresence>

                {/* Navigation Links */}
                <nav>
                    <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                        {isHomePage && ['Home', 'About', 'Contact'].map((item) => {
                            const id = item.toLowerCase();
                            return (
                                <li key={item}>
                                    <motion.button
                                        onClick={() => scrollTo(id)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: isMobileMenuOpen ? '1.2rem' : '0.9rem',
                                            fontWeight: activeSection === id ? '600' : '400',
                                            color: activeSection === id ? 'var(--primary)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            padding: '5px 2px',
                                            fontFamily: 'inherit',
                                            transition: 'color 0.25s ease',
                                            width: isMobileMenuOpen ? '100%' : 'auto',
                                            textAlign: isMobileMenuOpen ? 'left' : 'center',
                                        }}
                                    >
                                        {item}
                                        {activeSection === id && !isMobileMenuOpen && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '2px',
                                                    background: 'var(--primary)',
                                                    borderRadius: '2px',
                                                }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                    </motion.button>
                                </li>
                            );
                        })}

                        {!isHomePage && (
                            <li>
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: '500', fontSize: isMobileMenuOpen ? '1.2rem' : '0.9rem', padding: '5px 2px', display: 'block' }}>Home</Link>
                            </li>
                        )}

                        {user ? (
                            <>
                                {!isHomePage && (
                                    <li>
                                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{
                                            textDecoration: 'none',
                                            color: location.pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                                            fontWeight: location.pathname === '/dashboard' ? '600' : '500',
                                            fontSize: isMobileMenuOpen ? '1.2rem' : '0.9rem',
                                            padding: '5px 2px',
                                            display: 'block',
                                            position: 'relative'
                                        }}>
                                            Dashboard
                                            {location.pathname === '/dashboard' && !isMobileMenuOpen && (
                                                <motion.div
                                                    layoutId="nav-underline"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '2px',
                                                        background: 'var(--primary)',
                                                        borderRadius: '2px',
                                                    }}
                                                />
                                            )}
                                        </Link>
                                    </li>
                                )}

                                {isHomePage ? (
                                    <li>
                                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            padding: '8px 24px',
                                            borderRadius: '50px',
                                            textDecoration: 'none',
                                            fontSize: '0.95rem',
                                            fontWeight: '600',
                                            display: 'inline-block',
                                            boxShadow: '0 4px 14px rgba(167, 139, 250, 0.4)'
                                        }}>Dashboard</Link>
                                    </li>
                                ) : (
                                    <li>
                                        <button onClick={handleLogout} style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            padding: '8px 24px',
                                            borderRadius: '50px',
                                            fontFamily: 'inherit',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            fontWeight: '600',
                                            display: 'inline-block',
                                            boxShadow: '0 4px 14px rgba(167, 139, 250, 0.4)'
                                        }}>Logout</button>
                                    </li>
                                )}
                            </>
                        ) : (
                            <li>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '8px 24px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    display: 'inline-block',
                                    boxShadow: '0 4px 14px rgba(167, 139, 250, 0.4)'
                                }}>Sign In</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;
