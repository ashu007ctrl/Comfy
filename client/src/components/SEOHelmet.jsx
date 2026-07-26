import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://aistressanalyzer.netlify.app';

const SEOHelmet = ({
    title = "Comfy | AI Stress Analyzer & Mental Wellness Assessment",
    description = "Comfy is an AI-powered stress analyzer that helps you assess stress levels, detect burnout, and get personalized mental wellness insights — free and instant.",
    keywords = "Comfy, AI Stress Analyzer, AI stress detection, stress analysis, mental wellness, AI mental health, online stress test, free AI stress test, stress checker, burnout detection",
    ogImage = `${SITE_URL}/og-image.png`,
    url = `${SITE_URL}/`,
    type = "website",
    jsonLd = null
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
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content="Comfy" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:image:alt" content={title} />

            {/* Page-level JSON-LD */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHelmet;
