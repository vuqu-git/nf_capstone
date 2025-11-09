import styles from './IdentSlideGradient.module.css';
import Logo from '../../assets/Pupille-Logo.svg?react';
import { useTopHoverDetection } from "../../hooks/useTopHoverDetection.tsx";
import { CSSProperties } from 'react';
import {convertToLetterboxValue} from "../../utils/convertToLetterboxValue.ts";

interface Props {
    onBack: () => void;
    letterboxHeight?: number | string; // Accept number (pixels) or string (percentage/other units)
}

export default function IdentSlideGradient({ onBack, letterboxHeight = "20%" }: Readonly<Props>) {
    const { TopHoverBar } = useTopHoverDetection({ onTrigger: onBack });

    const wrapperStyle: CSSProperties = {
        '--letterbox-height': convertToLetterboxValue(letterboxHeight)
    } as CSSProperties;

    return (
        <div className={styles.wrapper} style={wrapperStyle}>
            <TopHoverBar />

            <div className={styles.contentArea}>
                <div className={styles.logo}>
                    <Logo />
                </div>
            </div>

            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>

            <div className={styles.letterbox}></div>
        </div>
    );
}
