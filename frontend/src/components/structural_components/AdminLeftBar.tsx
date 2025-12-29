import { useEffect, useState } from 'react';
import styles from './AdminLeftBar.module.css';

interface AdminLeftBarProps {
    message?: string[];               // Change type to string array
    threshold?: number;               // Distance from left in pixels
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

        // Add mouse‑move listener
        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup: remove event listener when component unmounts
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [threshold]);

    // If the bar shouldn't be visible, render nothing
    if (!isVisible) return null;

    return (
        <div className={styles.container}>
            {message.map((item, index) => {
                if (item === "\n") {
                    // Render a blank line
                    return <div key={index} className={styles.blank} />;
                }
                return (
                    <div key={index} className={styles.line}>
                        {item}
                    </div>
                );
            })}
        </div>
    );
}
