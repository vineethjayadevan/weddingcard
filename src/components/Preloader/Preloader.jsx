import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Preloader.module.css';
import { weddingData } from '../../data/config';

const Preloader = ({ onLoaded, isLoaded, onStart }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Allows the cross to draw fully before enabling the open button
    const timer = setTimeout(() => {
      onLoaded();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  const handleOpen = () => {
    setIsTransitioning(true);
    // Wait for the cinematic light expansion before starting the main scene
    setTimeout(() => {
      onStart();
    }, 2500);
  };

  return (
    <motion.div 
      className={styles.preloader}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2, ease: "easeInOut" } }}
    >
      <div className={styles.atmosphere}>
        <div className={styles.particles}></div>
        <motion.div 
          className={styles.centerGlow}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={isTransitioning ? { scale: 20, opacity: 1, background: "radial-gradient(circle, #FFF9E9 0%, #D6B56D 100%)" } : { scale: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "power2.inOut" }}
        />
      </div>

      {/* Cinematic Watermark Names (Running Background) */}
      <motion.div 
        className={styles.watermarkNames}
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 0.08 }}
        transition={{ delay: 3.5, duration: 2 }}
      >
        {/* Top Row - Scrolls Left */}
        <div className={`${styles.marqueeRow} ${styles.marqueeRowTop}`}>
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={`top-${i}`}>
              <span className={styles.watermarkName}>{weddingData.groom.name}</span>
              <span className={styles.watermarkSeparator}>✦</span>
              <span className={styles.watermarkName}>{weddingData.bride.name}</span>
              <span className={styles.watermarkSeparator}>✦</span>
            </React.Fragment>
          ))}
        </div>
        
        {/* Bottom Row - Scrolls Right */}
        <div className={`${styles.marqueeRow} ${styles.marqueeRowBottom}`}>
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={`bottom-${i}`}>
              <span className={styles.watermarkName}>{weddingData.bride.name}</span>
              <span className={styles.watermarkSeparator}>✦</span>
              <span className={styles.watermarkName}>{weddingData.groom.name}</span>
              <span className={styles.watermarkSeparator}>✦</span>
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className={styles.content}
        animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 1.1 : 1 }}
        transition={{ duration: 1.5, ease: "easeIn" }}
      >
        
        {/* The Sacred Cross */}
        <div className={styles.crossContainer}>
          {/* Subtle decorative halo */}
          <motion.div 
            className={styles.halo}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.5, duration: 2 }}
          />

          <svg viewBox="0 0 200 300" className={styles.sacredCross}>
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9E9" />
                <stop offset="50%" stopColor="#D6B56D" />
                <stop offset="100%" stopColor="#b8964d" />
              </linearGradient>
            </defs>

            {/* Center Light */}
            <motion.circle 
              cx="100" cy="120" r="1.5" 
              fill="#FFF9E9" 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />

            {/* Vertical Beam */}
            <motion.path 
              d="M 100 20 L 100 260" 
              stroke="url(#goldGradient)" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4, ease: "linear" }}
            />

            {/* Horizontal Beam */}
            <motion.path 
              d="M 40 120 L 160 120" 
              stroke="url(#goldGradient)" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.4, ease: "linear" }}
            />

            {/* Fine Filigree / Ornamental details */}
            <motion.g
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ delay: 1.8, duration: 0.8, ease: "easeInOut" }}
              stroke="#D6B56D" strokeWidth="0.5" fill="none"
            >
              {/* Inner curves */}
              <path d="M 95 120 Q 80 105 100 90 Q 120 105 105 120" />
              <path d="M 95 120 Q 80 135 100 150 Q 120 135 105 120" />
              <path d="M 100 115 Q 115 100 130 120 Q 115 140 100 125" />
              <path d="M 100 115 Q 85 100 70 120 Q 85 140 100 125" />
              
              {/* Outer corner flourishes */}
              <path d="M 85 105 C 95 95 95 95 95 85" />
              <path d="M 115 105 C 105 95 105 95 105 85" />
              <path d="M 85 135 C 95 145 95 145 95 155" />
              <path d="M 115 135 C 105 145 105 145 105 155" />
            </motion.g>

            {/* Tiny botanical / diamond details */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              fill="#D6B56D"
            >
              <polygon points="100,10 103,15 100,20 97,15" />
              <polygon points="100,260 103,265 100,270 97,265" />
              <polygon points="30,120 35,117 40,120 35,123" />
              <polygon points="170,120 165,117 160,120 165,123" />
            </motion.g>
          </svg>
        </div>

        {/* Wedding Message */}
        <motion.div 
          className={styles.messageContainer}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4, duration: 1.5 }}
        >
          <h2 className={styles.openingMessage}>{weddingData.openingMessage}</h2>
          
          <div className={styles.namesContainer}>
            <span className={styles.name}>{weddingData.bride.name}</span>
            <span className={styles.ampersand}>&</span>
            <span className={styles.name}>{weddingData.groom.name}</span>
          </div>

          <p className={styles.openingSubtext}>{weddingData.openingSubtext}</p>
        </motion.div>
        
        {/* Open Invitation Button */}
        <div className={styles.actionContainer}>
          <AnimatePresence>
            {isLoaded && !isTransitioning && (
              <motion.button 
                className={styles.openButton}
                onClick={handleOpen}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className={styles.buttonBorderGlow}></div>
                <span className={styles.buttonText}>Open Invitation</span>
                <span className={styles.buttonSubtext}>Tap to enter</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default Preloader;
