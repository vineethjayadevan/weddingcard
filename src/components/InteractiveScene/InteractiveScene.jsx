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

  // Hotspots repositioned to sit naturally around the chapel entrance
  const hotspots = [
    { id: 'date', label: 'Wedding Date', icon: Calendar, top: '55%', left: '30%' },
    { id: 'venue', label: 'Venue', icon: MapPin, top: '55%', left: '70%' },
    { id: 'story', label: 'Our Story', icon: BookOpen, top: '75%', left: '35%' },
    { id: 'couple', label: 'The Couple', icon: Heart, top: '75%', left: '65%' },
  ];

  // Gyro / Parallax logic (Preserved exactly as requested)
  useEffect(() => {
    if (!hasStarted) return;
    
    const handleMouseMove = (e) => {
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
        let gamma = e.gamma;
        let beta = e.beta;
        
        if (gamma > 30) gamma = 30;
        if (gamma < -30) gamma = -30;
        
        let adjustedBeta = beta - 45;
        if (adjustedBeta > 30) adjustedBeta = 30;
        if (adjustedBeta < -30) adjustedBeta = -30;

        xPos = (gamma / 30) * 15; 
        yPos = (adjustedBeta / 30) * 15;
      }

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = index + 1;
        gsap.to(layer, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 0.5, 
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
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

  // Opening Cinematic Animation (Preserved exactly as requested)
  useEffect(() => {
    if (hasStarted) {
      gsap.fromTo(sceneRef.current, 
        { scale: 1.05, opacity: 0, filter: 'blur(10px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 3, ease: "power2.inOut" }
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
      case 'couple': return <Couple />;
      case 'date':
      case 'venue': return <WeddingDetails />;
      case 'story': return <Story />;
      default: return null;
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
        
        {/* Layer 1: Background Atmosphere (Navy + Particles) */}
        <div className={`${styles.layer} ${styles.layerAtmosphere}`} ref={el => layersRef.current[0] = el}>
           <div className={styles.dustParticles}></div>
           <div className={styles.haze}></div>
        </div>
        
        {/* Layer 2: Chapel Architecture & Stained Glass (Vector Illustrated) */}
        <div className={`${styles.layer} ${styles.layerChapel}`} ref={el => layersRef.current[1] = el}>
          <svg className={styles.chapelSvg} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="altarGlow" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#D6B56D" stopOpacity="0.5" />
                <stop offset="30%" stopColor="#D6B56D" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#07111F" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lightRay" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#D6B56D" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#D6B56D" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Ambient Altar Glow */}
            <circle cx="500" cy="500" r="450" fill="url(#altarGlow)" className={styles.breathingGlow} />
            
            {/* Chapel Pillars */}
            <rect x="250" y="100" width="60" height="900" fill="#03080f" stroke="rgba(214, 181, 109, 0.2)" strokeWidth="1" />
            <rect x="690" y="100" width="60" height="900" fill="#03080f" stroke="rgba(214, 181, 109, 0.2)" strokeWidth="1" />
            
            {/* Inner Archway */}
            <path d="M 310 900 L 310 400 A 190 190 0 0 1 690 400 L 690 900" fill="none" stroke="rgba(214, 181, 109, 0.15)" strokeWidth="4" />
            <path d="M 330 900 L 330 420 A 170 170 0 0 1 670 420 L 670 900" fill="none" stroke="rgba(214, 181, 109, 0.3)" strokeWidth="2" />

            {/* Stained Glass Window */}
            <g className={styles.stainedGlassGroup}>
              {/* Outer Arch */}
              <path d="M 410 550 L 410 320 A 90 90 0 0 1 590 320 L 590 550 Z" fill="#0D1A2B" stroke="#D6B56D" strokeWidth="3" />
              
              {/* Inner Lead Lines & Glass Panels */}
              <path d="M 410 400 L 590 400" stroke="rgba(214, 181, 109, 0.8)" strokeWidth="1.5" />
              <path d="M 410 480 L 590 480" stroke="rgba(214, 181, 109, 0.8)" strokeWidth="1.5" />
              <path d="M 500 230 L 500 550" stroke="rgba(214, 181, 109, 0.8)" strokeWidth="1.5" />
              
              <path d="M 410 320 A 90 90 0 0 1 500 230 L 500 320 Z" fill="rgba(66, 28, 43, 0.6)" />
              <path d="M 590 320 A 90 90 0 0 0 500 230 L 500 320 Z" fill="rgba(66, 28, 43, 0.4)" />
              
              <rect x="410" y="320" width="90" height="80" fill="rgba(214, 181, 109, 0.15)" />
              <rect x="500" y="320" width="90" height="80" fill="rgba(247, 241, 229, 0.1)" />
              <rect x="410" y="400" width="90" height="80" fill="rgba(66, 28, 43, 0.3)" />
              <rect x="500" y="400" width="90" height="80" fill="rgba(66, 28, 43, 0.5)" />
              <rect x="410" y="480" width="90" height="70" fill="rgba(214, 181, 109, 0.2)" />
              <rect x="500" y="480" width="90" height="70" fill="rgba(247, 241, 229, 0.15)" />

              {/* The Cross - Thin, Elegant, Discovered naturally */}
              <line x1="500" y1="350" x2="500" y2="450" stroke="#D6B56D" strokeWidth="3" className={styles.svgCross} />
              <line x1="475" y1="380" x2="525" y2="380" stroke="#D6B56D" strokeWidth="3" className={styles.svgCross} />
            </g>
            
            {/* Light Rays */}
            <polygon points="410,320 590,320 850,1000 150,1000" fill="url(#lightRay)" className={styles.lightRays} />
          </svg>
        </div>

        {/* Layer 3: The Wedding Aisle */}
        <div className={`${styles.layer} ${styles.layerAisle}`} ref={el => layersRef.current[2] = el}>
          <div className={styles.aislePath}></div>
        </div>

        {/* Layer 4: Interactive Hotspots */}
        <div className={`${styles.layer} ${styles.layerInteractive}`} ref={el => layersRef.current[3] = el}>
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
                  transition={{ delay: 2.5 + (index * 0.2), duration: 0.6, type: 'spring' }}
                  onClick={() => handleHotspotClick(hotspot.id)}
                >
                  <div className={styles.hotspotPulse}></div>
                  <div className={styles.hotspotContent}>
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className={styles.hotspotLabel}>{hotspot.label}</span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Layer 5: Foreground (Flowers framing the chapel & Candles) */}
        <div className={`${styles.layer} ${styles.layerForeground}`} ref={el => layersRef.current[4] = el}>
          
          <div className={styles.floralPlaceholderLeft}>
            {/* Placeholder for future flowers-left.svg asset */}
            <div className={styles.floralSilhouette}></div>
            
            {/* Realistic Candle Grouping */}
            <div className={`${styles.candleGroup} ${styles.candleGroupLeft}`}>
              <div className={styles.candleStem}></div>
              <div className={styles.candleFlame} style={{ animationDelay: '0s' }}>
                <div className={styles.candleGlow}></div>
              </div>
            </div>
            <div className={`${styles.candleGroup} ${styles.candleGroupLeftSmall}`}>
              <div className={styles.candleStemSmall}></div>
              <div className={styles.candleFlame} style={{ animationDelay: '1.2s' }}>
                <div className={styles.candleGlow}></div>
              </div>
            </div>
          </div>

          <div className={styles.floralPlaceholderRight}>
            {/* Placeholder for future flowers-right.svg asset */}
            <div className={styles.floralSilhouette}></div>
            <div className={`${styles.candleGroup} ${styles.candleGroupRight}`}>
              <div className={styles.candleStem}></div>
              <div className={styles.candleFlame} style={{ animationDelay: '1.5s' }}>
                <div className={styles.candleGlow}></div>
              </div>
            </div>
          </div>

          {/* Cinematic framing vignette at the bottom */}
          <div className={styles.foregroundVignette}></div>
        </div>

      </div>

      {/* Functionality preserved */}
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
