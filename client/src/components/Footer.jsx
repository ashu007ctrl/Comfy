import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '2rem 0',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <div className="container">
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    © 2025 - All Rights Reserved !
                </p>
            </div>
        </footer>
    );
};

export default Footer;
