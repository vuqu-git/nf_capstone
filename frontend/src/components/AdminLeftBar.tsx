import { useEffect, useState } from 'react';

interface AdminLeftBarProps {
    message?: string[]; // Change type to string array
    threshold?: number; // Distance from left in pixels
}

export default function AdminLeftBar({
                                         message = ["⚠️ You're at the left side of the page"], // Default message as an array
                                         threshold = 200,
                                     }: Readonly<AdminLeftBarProps>) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Check if cursor is within threshold pixels from the left
            if (e.clientX <= threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup: remove event listener when component unmounts
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [threshold]);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                // width: '150px', // Set a width for the bar
                height: '100%', // Make it full height
                // backgroundColor: "rgba(148, 0, 211, 0.8)", // with transparent
                backgroundColor: "rgba(148, 0, 211)",
                color: 'white',
                display: 'flex',
                flexDirection: 'column', // Stack items vertically
                alignItems: 'center', // Center items horizontally
                justifyContent: 'center', // Center items vertically
                padding: '10px',
                zIndex: 9999,
                // fontWeight: 'bold',
                boxShadow: '2px 0 5px rgba(0,0,0,0.2)' // Shadow to the right
            }}
        >
            {message.map((item, index) => {
                if (item === "\n") {
                    return <div key={index} style={{ marginBottom: '15px' }} />; // Render a blank line
                }
                return (
                    <div key={index} style={{ marginBottom: '5px' }}>
                        {item}
                    </div>
                );
            })}
        </div>
    );
}
