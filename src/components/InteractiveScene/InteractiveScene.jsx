import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import styles from './InteractiveScene.module.css';
import { Calendar, MapPin, Heart, BookOpen, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Modal from '../UI/Modal';
import Couple from '../Sections/Couple';
import WeddingDetails from '../Sections/WeddingDetails';
import Story from '../Sections/Story';
import { weddingData } from '../../data/config';

const InteractiveScene = ({ hasStarted, hasOrientationPermission }) => {
  const sceneRef = useRef(null);
  const layersRef = useRef([]);
  const [activeModal, setActiveModal] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Redesigned Magical Hotspots, repositioned carefully to frame the chapel
  const hotspots = [
    { id: 'foundation', label: 'Our Foundation', icon: BookOpen, top: '55%', left: '25%' },
    { id: 'date', label: 'Wedding Date', icon: Calendar, top: '55%', left: '75%' },
    { id: 'venue', label: 'Venue', icon: MapPin, top: '75%', left: '30%' },
    { id: 'story', label: 'Our Story', icon: Heart, top: '75%', left: '70%' },
    { id: 'gallery', label: 'Gallery', icon: Camera, top: '85%', left: '50%' },
  ];

  // Gyro / Parallax logic (Maintained exactly as requested)
  useEffect(() => {
    if (!hasStarted) return;
    
    const handleMouseMove = (e) => {
      if (activeModal) return;

      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20; 
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      layersRef.current.forEach((layer, index) => {
        if (!layer) return;
        const depth = index * 0.4;
        gsap.to(layer, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 1.5,
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
        const depth = index * 0.4;
        gsap.to(layer, {
          x: xPos * depth,
          y: yPos * depth,
          duration: 0.8, 
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

  // Master Cinematic Opening GSAP Timeline
  useEffect(() => {
    if (hasStarted) {
      const tl = gsap.timeline();
      
      // 1. Camera moves forward out of the darkness
      tl.fromTo(sceneRef.current, 
        { scale: 1.12, filter: 'blur(12px)', opacity: 0 },
        { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 4.5, ease: "power2.out" },
        0
      );

      // 2. Chapel Architecture emerges
      tl.fromTo(layersRef.current[2], 
        { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 3, ease: "power1.out" }, 1.0
      );

      // 3. Stained Glass ignites
      tl.fromTo(layersRef.current[3],
        { opacity: 0 }, { opacity: 1, duration: 3 }, 1.8
      );

      // 4. Interior Light & Cross illuminate
      tl.fromTo(layersRef.current[4],
        { opacity: 0 }, { opacity: 1, duration: 3 }, 2.0
      );
      tl.fromTo(layersRef.current[5],
        { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 2 }, 2.2
      );

      // 5. Wedding Aisle appears
      tl.fromTo(layersRef.current[6],
        { opacity: 0 }, { opacity: 1, duration: 2 }, 2.5
      );

      // 6. Candles light up sequentially down the aisle
      tl.fromTo('.cinematicCandle',
        { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.5, stagger: 0.3, ease: "back.out(1.5)" }, 2.8
      );

      // 7. Midground & Foreground Flowers fade in
      tl.fromTo('.cinematicFlora',
        { opacity: 0 }, { opacity: 1, duration: 3 }, 3.0
      );

      // 8. Typography overlay (Names & Date)
      tl.fromTo(layersRef.current[9],
        { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 2 }, 4.0
      );
    }
  }, [hasStarted]);

  const handleHotspotClick = (id) => {
    setHasInteracted(true);
    setActiveModal(id);
  };

  const closeModal = () => setActiveModal(null);

  const renderModalContent = () => {
    switch(activeModal) {
      case 'foundation':
      case 'story': return <Story />;
      case 'date':
      case 'venue': return <WeddingDetails />;
      case 'couple': return <Couple />;
      case 'gallery': return <Story />; // Gallery Placeholder mapping
      default: return null;
    }
  };

  const getModalTitle = () => {
    switch(activeModal) {
      case 'foundation': return 'Our Foundation';
      case 'story': return 'Our Story';
      case 'date': return 'When & Where';
      case 'venue': return 'Venue Details';
      case 'gallery': return 'Gallery';
      default: return '';
    }
  };

  return (
    <>
      <div className={styles.sceneContainer} ref={sceneRef}>
        
        {/* Layer 0: Sky, Image & Particles */}
        <div className={`${styles.layer} ${styles.layerAtmosphere}`} ref={el => layersRef.current[0] = el}>
           <img 
             src="/opening-bg.jpeg" 
             alt="Cinematic Background" 
             className={styles.backgroundImage}
             onError={(e) => e.target.style.display = 'none'} 
           />
           <div className={styles.atmosphereOverlay}></div>
           <div className={styles.dustParticles}></div>
        </div>

        {/* Layer 1: Distant Light & Haze */}
        <div className={`${styles.layer} ${styles.layerHaze}`} ref={el => layersRef.current[1] = el}>
          <div className={styles.haze}></div>
        </div>
        
        {/* Layer 2: Chapel Architecture */}
        <div className={`${styles.layer} ${styles.layerChapel}`} ref={el => layersRef.current[2] = el}>
          <svg className={styles.chapelSvg} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            <rect x="250" y="100" width="60" height="900" fill="#03080f" stroke="rgba(214, 181, 109, 0.2)" strokeWidth="1" />
            <rect x="690" y="100" width="60" height="900" fill="#03080f" stroke="rgba(214, 181, 109, 0.2)" strokeWidth="1" />
            <path d="M 310 900 L 310 400 A 190 190 0 0 1 690 400 L 690 900" fill="none" stroke="rgba(214, 181, 109, 0.15)" strokeWidth="4" />
            <path d="M 330 900 L 330 420 A 170 170 0 0 1 670 420 L 670 900" fill="none" stroke="rgba(214, 181, 109, 0.3)" strokeWidth="2" />
          </svg>
        </div>

        {/* Layer 3: Stained Glass */}
        <div className={`${styles.layer} ${styles.layerStainedGlass}`} ref={el => layersRef.current[3] = el}>
          <svg className={styles.chapelSvg} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            <g className={styles.stainedGlassGroup}>
              <path d="M 410 550 L 410 320 A 90 90 0 0 1 590 320 L 590 550 Z" fill="#0D1A2B" stroke="#D6B56D" strokeWidth="3" />
              
              <path d="M 410 400 L 590 400" stroke="rgba(214, 181, 109, 0.8)" strokeWidth="1.5" />
              <path d="M 410 480 L 590 480" stroke="rgba(214, 181, 109, 0.8)" strokeWidth="1.5" />
              <path d="M 500 230 L 500 550" stroke="rgba(214, 181, 109, 0.8)" strokeWidth="1.5" />
              
              <path d="M 410 320 A 90 90 0 0 1 500 230 L 500 320 Z" fill="rgba(66, 28, 43, 0.6)" />
              <path d="M 590 320 A 90 90 0 0 0 500 230 L 500 320 Z" fill="rgba(11, 28, 56, 0.7)" />
              
              <rect x="410" y="320" width="90" height="80" fill="rgba(214, 181, 109, 0.15)" />
              <rect x="500" y="320" width="90" height="80" fill="rgba(247, 241, 229, 0.1)" />
              <rect x="410" y="400" width="90" height="80" fill="rgba(66, 28, 43, 0.4)" />
              <rect x="500" y="400" width="90" height="80" fill="rgba(11, 28, 56, 0.6)" />
              <rect x="410" y="480" width="90" height="70" fill="rgba(214, 181, 109, 0.2)" />
              <rect x="500" y="480" width="90" height="70" fill="rgba(247, 241, 229, 0.15)" />
            </g>
          </svg>
        </div>

        {/* Layer 4: Interior Lighting (Breathing Effect) */}
        <div className={`${styles.layer} ${styles.layerInteriorLight}`} ref={el => layersRef.current[4] = el}>
          <svg className={styles.chapelSvg} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="altarGlow" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#D6B56D" stopOpacity="0.45" />
                <stop offset="40%" stopColor="#D6B56D" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#07111F" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lightRay" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#D6B56D" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#D6B56D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="500" cy="500" r="450" fill="url(#altarGlow)" className={styles.breathingGlow} />
            <polygon points="410,320 590,320 850,1000 150,1000" fill="url(#lightRay)" className={styles.lightRays} />
          </svg>
        </div>

        {/* Layer 5: The Sacred Cross */}
        <div className={`${styles.layer} ${styles.layerCross}`} ref={el => layersRef.current[5] = el}>
          <svg className={styles.chapelSvg} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            <line x1="500" y1="340" x2="500" y2="460" stroke="#D6B56D" strokeWidth="4" className={styles.svgCross} />
            <line x1="470" y1="380" x2="530" y2="380" stroke="#D6B56D" strokeWidth="4" className={styles.svgCross} />
          </svg>
        </div>

        {/* Layer 6: Wedding Aisle */}
        <div className={`${styles.layer} ${styles.layerAisle}`} ref={el => layersRef.current[6] = el}>
          <div className={styles.aislePath}></div>
        </div>

        {/* Layer 7: Candles (Staggered Ignite) */}
        <div className={`${styles.layer} ${styles.layerCandles}`} ref={el => layersRef.current[7] = el}>
          <div className={`${styles.candleGroup} ${styles.candle1} cinematicCandle`}>
            <div className={styles.candleStem}></div>
            <div className={styles.candleFlame} style={{ animationDelay: '0s' }}><div className={styles.candleGlow}></div></div>
          </div>
          <div className={`${styles.candleGroup} ${styles.candle2} cinematicCandle`}>
            <div className={styles.candleStemSmall}></div>
            <div className={styles.candleFlame} style={{ animationDelay: '0.4s' }}><div className={styles.candleGlow}></div></div>
          </div>
          <div className={`${styles.candleGroup} ${styles.candle3} cinematicCandle`}>
            <div className={styles.candleStem}></div>
            <div className={styles.candleFlame} style={{ animationDelay: '0.8s' }}><div className={styles.candleGlow}></div></div>
          </div>
          <div className={`${styles.candleGroup} ${styles.candle4} cinematicCandle`}>
            <div className={styles.candleStemSmall}></div>
            <div className={styles.candleFlame} style={{ animationDelay: '1.2s' }}><div className={styles.candleGlow}></div></div>
          </div>
        </div>

        {/* Layer 8: Midground Flowers */}
        <div className={`${styles.layer} ${styles.layerMidFlowers} cinematicFlora`} ref={el => layersRef.current[8] = el}>
           <div className={styles.floralPlaceholderLeft}><div className={styles.floralSilhouette}></div></div>
           <div className={styles.floralPlaceholderRight}><div className={styles.floralSilhouette}></div></div>
        </div>

        {/* Layer 9: Typography Overlay (Names & Date) */}
        <div className={`${styles.layer} ${styles.layerTypography}`} ref={el => layersRef.current[9] = el}>
          <div className={styles.typographyContent}>
            <h1 className={styles.sceneNames}>{weddingData.bride.name} <span className={styles.sceneAmp}>&</span> {weddingData.groom.name}</h1>
            <p className={styles.sceneDate}>{weddingData.wedding.date}</p>
          </div>
        </div>

        {/* Layer 10: Interactive Hotspots (Magical Objects) */}
        <div className={`${styles.layer} ${styles.layerInteractive}`} ref={el => layersRef.current[10] = el}>
          <AnimatePresence>
            {hasStarted && hotspots.map((hotspot, index) => {
              const Icon = hotspot.icon;
              return (
                <motion.div
                  key={hotspot.id}
                  className={styles.hotspot}
                  style={{ top: hotspot.top, left: hotspot.left }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 5 + (index * 0.3), duration: 1, ease: "easeOut" }}
                  onClick={() => handleHotspotClick(hotspot.id)}
                >
                  <div className={styles.hotspotContent}>
                    <Icon size={24} strokeWidth={1.5} />
                    <span className={styles.hotspotLabel}>{hotspot.label}</span>
                  </div>
                  {/* Subtle Interactive Hint */}
                  {index === 0 && !hasInteracted && (
                    <div className={styles.interactionHint}>Explore our story</div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Layer 11: Foreground Blurred Foliage (Depth of Field) */}
        <div className={`${styles.layer} ${styles.layerForeground} cinematicFlora`} ref={el => layersRef.current[11] = el}>
          <div className={styles.foregroundFoliageLeft}></div>
          <div className={styles.foregroundFoliageRight}></div>
          <div className={styles.foregroundVignette}></div>
        </div>

      </div>

      <Modal isOpen={activeModal !== null} onClose={closeModal} title={getModalTitle()}>
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default InteractiveScene;
