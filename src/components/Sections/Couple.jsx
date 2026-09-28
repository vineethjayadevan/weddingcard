import React from 'react';
import { weddingData } from '../../data/config';
import styles from './Section.module.css';

const Couple = () => {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.person}>
        <h3 className={styles.name}>{weddingData.bride.name}</h3>
        <p className={styles.familyText}>Daughter of {weddingData.family.bride[0]}</p>
      </div>
      
      <div className={styles.divider}>
        <span>&</span>
      </div>
      
      <div className={styles.person}>
        <h3 className={styles.name}>{weddingData.groom.name}</h3>
        <p className={styles.familyText}>Son of {weddingData.family.groom[0]}</p>
      </div>
    </div>
  );
};

export default Couple;
