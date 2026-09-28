import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Preloader.module.css';
import { weddingData } from '../../data/config';

const Preloader = ({ onLoaded, isLoaded, onStart }) => {
  useEffect(() => {
    // Simulate asset loading
    const timer = setTimeout(() => {
      onLoaded();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <motion.div 
      className={styles.preloader}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
    >
      <div className={styles.content}>
        <motion.div 
          className={styles.monogramContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className={styles.monogramBorder}>
            <span className={styles.cross}>+</span>
            <h1 className={styles.initials}>
              {weddingData.bride.shortName[0]} <span className={styles.ampersand}>&</span> {weddingData.groom.shortName[0]}
            </h1>
            <div className={styles.botanicalDecoration}>
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6C15 6 10 10 0 10C10 10 15 2 20 2C25 2 30 10 40 10C30 10 25 6 20 6Z" fill="var(--color-primary)" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </motion.div>
        
        <div className={styles.loaderContainer}>
          {!isLoaded ? (
            <motion.div 
              className={styles.loaderLine}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5 }}
            />
          ) : (
            <motion.button 
              className={styles.startButton}
              onClick={onStart}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter the Celebration
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
