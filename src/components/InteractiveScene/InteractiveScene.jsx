import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import styles from './InteractiveScene.module.css';
import { Calendar, MapPin, Heart, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Modal from '../UI/Modal';
import Couple from '../Sections/Couple';
import WeddingDetails from '../Sections/WeddingDetails';
import Story from '../Sections/Story';

const InteractiveScene = ({ hasStarted, hasOrientationPermission }) => {
  const sceneRef = useRef(null);
  const layersRef = useRef([]);
  const [activeModal, setActiveModal] = useState(null);

  const hotspots = [
    { id: 'date', label: 'Wedding Date', icon: Calendar, top: '35%', left: '30%' },
    { id: 'venue', label: 'Venue', icon: MapPin, top: '65%', left: '75%' },
    { id: 'story', label: 'Our Story', icon: BookOpen, top: '75%', left: '25%' },
    { id: 'couple', label: 'The Couple', icon: Heart, top: '45%', left: '60%' },
  ];

  // Gyro / Parallax logic
  useEffect(() => {
    if (!hasStarted) return;
    
    const handleMouseMove = (e) => {
      // Disable parallax if a modal is open so it's not distracting
      if (activeModal) return;

      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20; 
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = index + 1;
        gsap.to(layer, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 1,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };

    const handleDeviceOrientation = (e) => {
      if (activeModal) return;
      
      let xPos = 0;
      let yPos = 0;

      if (e.gamma !== null && e.beta !== null) {
        // gamma is left-to-right tilt (-90 to 90)
        let gamma = e.gamma;
        // beta is front-to-back tilt (-180 to 180)
        let beta = e.beta;
        
        // Constrain values to avoid wild spinning
        if (gamma > 30) gamma = 30;
        if (gamma < -30) gamma = -30;
        
        // Assume natural holding position is tilted up slightly (approx 45 degrees)
        let adjustedBeta = beta - 45;
        if (adjustedBeta > 30) adjustedBeta = 30;
        if (adjustedBeta < -30) adjustedBeta = -30;

        xPos = (gamma / 30) * 15; // Max 15px move
        yPos = (adjustedBeta / 30) * 15;
      }

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = index + 1;
        gsap.to(layer, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 0.5, // Faster response for gyro
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };

    // Always add mouse move for desktop
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add gyro for mobile if permission granted
    if (hasOrientationPermission) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hasOrientationPermission) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [hasStarted, activeModal, hasOrientationPermission]);

  // Opening Cinematic Animation
  useEffect(() => {
    if (hasStarted) {
      gsap.fromTo(sceneRef.current, 
        { scale: 1.1, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2.5, ease: "power3.inOut" }
      );
    }
  }, [hasStarted]);

  const handleHotspotClick = (id) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderModalContent = () => {
    switch(activeModal) {
      case 'couple':
        return <Couple />;
      case 'date':
      case 'venue':
        return <WeddingDetails />;
      case 'story':
        return <Story />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch(activeModal) {
      case 'couple': return 'The Couple';
      case 'date': return 'When & Where';
      case 'venue': return 'Venue Details';
      case 'story': return 'Our Story';
      default: return '';
    }
  };

  return (
    <>
      <div className={styles.sceneContainer} ref={sceneRef}>
        {/* Layer 0: Background Deep Color / Ambient */}
        <div 
          className={`${styles.layer} ${styles.layerBackground}`} 
          ref={el => layersRef.current[0] = el}
        >
           <div className={styles.ambientGlow}></div>
        </div>
        
        {/* Layer 1: Architecture / Mandapam Base */}
        <div 
          className={`${styles.layer} ${styles.layerMid}`} 
          ref={el => layersRef.current[1] = el}
        />

        {/* Layer 2: Interactive elements (Hotspots) */}
        <div 
          className={`${styles.layer} ${styles.layerInteractive}`} 
          ref={el => layersRef.current[2] = el}
        >
          <AnimatePresence>
            {hasStarted && hotspots.map((hotspot, index) => {
              const Icon = hotspot.icon;
              return (
                <motion.div
                  key={hotspot.id}
                  className={styles.hotspot}
                  style={{ top: hotspot.top, left: hotspot.left }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2 + (index * 0.2), duration: 0.6, type: 'spring' }}
                  onClick={() => handleHotspotClick(hotspot.id)}
                >
                  <div className={styles.hotspotPulse}></div>
                  <div className={styles.hotspotContent}>
                    <Icon size={20} />
                  </div>
                  <span className={styles.hotspotLabel}>{hotspot.label}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Layer 3: Foreground (e.g. Floating leaves/lights) */}
        <div 
          className={`${styles.layer} ${styles.layerForeground}`} 
          ref={el => layersRef.current[3] = el}
        />
      </div>

      <Modal 
        isOpen={activeModal !== null} 
        onClose={closeModal}
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default InteractiveScene;
