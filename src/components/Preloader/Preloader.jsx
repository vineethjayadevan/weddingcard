import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Preloader.module.css';
import { weddingData } from '../../data/config';

const Preloader = ({ onLoaded, isLoaded, onStart }) => {
  useEffect(() => {
    // Simulate asset loading. In a real scenario, preload images here.
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
        <motion.h1 
          className={styles.initials}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {weddingData.bride.shortName[0]} & {weddingData.groom.shortName[0]}
        </motion.h1>
        
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tap to Begin
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
