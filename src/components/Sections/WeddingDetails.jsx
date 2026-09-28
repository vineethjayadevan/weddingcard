import React from 'react';
import { weddingData } from '../../data/config';
import styles from './Section.module.css';
import { Map } from 'lucide-react';

const WeddingDetails = () => {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.detailBlock}>
        <h4 className={styles.subheading}>When</h4>
        <p className={styles.mainText}>{weddingData.wedding.date}</p>
        <p className={styles.subText}>{weddingData.wedding.time}</p>
      </div>
      
      <div className={styles.detailBlock}>
        <h4 className={styles.subheading}>Where</h4>
        <p className={styles.mainText}>{weddingData.wedding.venue}</p>
        <p className={styles.subText}>{weddingData.wedding.address}</p>
      </div>
      
      <button className={styles.actionButton}>
        <Map size={18} className={styles.buttonIcon} />
        View on Maps
      </button>
    </div>
  );
};

export default WeddingDetails;
