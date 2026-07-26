import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import SEOContent from '../components/SEOContent';
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
                title="Comfy | AI Stress Analyzer & Mental Wellness Assessment"
                description="Comfy is an AI-powered stress analyzer that helps you assess stress levels, detect burnout, and get personalized mental wellness insights — free and instant."
                keywords="Comfy, AI Stress Analyzer, AI stress detection, stress analysis, mental wellness, AI mental health, online stress test, free AI stress test, anxiety assessment, burnout detection, stress management, mental health assessment"
                url="https://aistressanalyzer.netlify.app/"
            />
            <motion.section id="home" variants={sectionVariants}>
                <Hero onStart={onStart} />
            </motion.section>

            <motion.div variants={sectionVariants}>
                <About />
            </motion.div>

            <motion.div variants={sectionVariants}>
                <SEOContent onStart={onStart} />
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
