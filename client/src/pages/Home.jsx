import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SEOHelmet from '../components/SEOHelmet';

const Home = ({ onStart }) => {
    // Scroll to top on mount/refresh to prevent header overlap
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Staggered animation for page load
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <SEOHelmet
                title="Comfy - AI-Powered Stress Detection & Mental Wellness"
                description="Take our free AI-powered stress assessment test and get personalized stress management recommendations. Scientifically designed questionnaire with instant results powered by Google Gemini AI."
                keywords="stress test, mental health, stress detection, AI stress analysis, stress management, mental wellness, free stress test, anxiety assessment, mental health assessment"
                url="https://yourwebsite.com/"
            />
            <Header />
            <motion.section id="home" variants={sectionVariants}>
                <Hero onStart={onStart} />
            </motion.section>

            <motion.div variants={sectionVariants}>
                <About />
            </motion.div>

            <motion.div variants={sectionVariants}>
                <Contact />
            </motion.div>

            <motion.div variants={sectionVariants}>
                <Footer />
            </motion.div>
        </motion.div>
    );
};

export default Home;
