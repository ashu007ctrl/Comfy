import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Header = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Update active section based on scroll position could be more complex, 
            // but simplistic view check for now:
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
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.header
            className={`header ${scrolled ? 'scrolled' : ''}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
                padding: '20px 0',
                transition: 'all 0.3s ease',
                background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(255, 255, 255, 0.2)',
            }}
        >
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.div
                    className="logo"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        letterSpacing: '-0.03em',
                        color: scrolled ? 'var(--primary)' : '#ffffff',
                        cursor: 'pointer'
                    }}
                    onClick={() => scrollTo('home')}
                >
                    Comfy
                </motion.div>

                <nav>
                    <ul style={{ display: 'flex', listStyle: 'none', gap: '30px' }}>
                        {['Home', 'About', 'Contact'].map((item) => {
                            const id = item.toLowerCase();
                            return (
                                <li key={item}>
                                    <motion.button
                                        onClick={() => scrollTo(id)}
                                        whileHover={{ scale: 1.1, color: scrolled ? '#7c3aed' : '#06b6d4' }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1rem',
                                            fontWeight: scrolled ? '700' : (activeSection === id ? '600' : '400'),
                                            color: scrolled
                                                ? (activeSection === id ? '#000000' : '#1e293b')
                                                : (activeSection === id ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'),
                                            cursor: 'pointer',
                                            position: 'relative',
                                            padding: '5px 0'
                                        }}
                                    >
                                        {item}
                                        {activeSection === id && (
                                            <motion.div
                                                layoutId="underline"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '2px',
                                                    background: scrolled ? '#000000' : '#ffffff',
                                                    borderRadius: '2px'
                                                }}
                                            />
                                        )}
                                    </motion.button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </motion.header>
    );
};

export default Header;
