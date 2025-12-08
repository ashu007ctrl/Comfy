import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({
    title = "Comfy - AI-Powered Stress Detection & Mental Wellness",
    description = "Take our free AI-powered stress assessment test and get personalized stress management recommendations. Scientifically designed questionnaire with instant results powered by Google Gemini AI.",
    keywords = "stress test, mental health, stress detection, AI stress analysis, stress management, mental wellness, anxiety test, stress assessment",
    ogImage = "https://yourwebsite.com/og-image.png",
    twitterImage = "https://yourwebsite.com/twitter-image.png",
    url = "https://yourwebsite.com/",
    type = "website"
}) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={twitterImage} />
        </Helmet>
    );
};

export default SEOHelmet;
