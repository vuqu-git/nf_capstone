import { useEffect, useRef } from "react";
import './BackToTopButton.css';

interface BackToTopButtonProps {
    scrollThreshold?: number;
    parentId: string; // ID of the parent container
    rightPercent?: number; // Percentage (0.05 for 5%) offset from parent's right edge
}

export default function BackToTopButton({
                                            scrollThreshold = 300,
                                            parentId,
                                            rightPercent = 0 // Default: flush with parent's right edge
                                        }: BackToTopButtonProps) {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const btn = btnRef.current;
        const parent = document.getElementById(parentId);

        const updatePosition = () => {
            if (!btn || !parent) return;
            const parentRect = parent.getBoundingClientRect();
            const parentWidth = parentRect.width;

            // Calculate pixel offset as a percentage of parent's width
            const pixelOffset = parentWidth * rightPercent;
            // Position button relative to parent's right edge, plus offset
            const rightOffset = window.innerWidth - parentRect.right + pixelOffset;

            btn.style.right = `${rightOffset}px`;
        };

        const handleScroll = () => {
            if (!btn) return;
            btn.classList.toggle('show', window.scrollY > scrollThreshold);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollThreshold, parentId, rightPercent]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            ref={btnRef}
            onClick={scrollToTop}
            className="backToTopBtn"
        >
            &#9650;️
        </button>
    );
}