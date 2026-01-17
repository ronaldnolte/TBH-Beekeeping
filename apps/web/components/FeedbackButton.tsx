'use client';

import { useState } from 'react';

export default function FeedbackButton() {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        const subject = encodeURIComponent('TBH Beekeeper Feedback');
        const body = encodeURIComponent(
            'Hi,\n\nI have some feedback about TBH Beekeeper:\n\n'
        );
        window.location.href = `mailto:feedback@beektools.com?subject=${subject}&body=${body}`;
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isHovered ? '#D97706' : '#F5A623',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                zIndex: 9999,
            }}
            title="Send Feedback"
            aria-label="Send Feedback"
        >
            {/* Message/envelope icon */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        </button>
    );
}
