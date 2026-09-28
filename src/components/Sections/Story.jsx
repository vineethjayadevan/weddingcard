import React from 'react';
import { weddingData } from '../../data/config';
import styles from './Section.module.css';

const Story = () => {
  return (
    <div className={styles.timeline}>
      {weddingData.story.map((event, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineYear}>{event.year}</div>
          <div className={styles.timelineContent}>
            <h4 className={styles.timelineTitle}>{event.title}</h4>
            <p className={styles.timelineDesc}>{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Story;
