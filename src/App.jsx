import React, { useState } from 'react';
import Preloader from './components/Preloader/Preloader';
import InteractiveScene from './components/InteractiveScene/InteractiveScene';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [orientationPermission, setOrientationPermission] = useState(false);

  const handleStart = async () => {
    // Request device orientation permission for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setOrientationPermission(true);
        }
      } catch (error) {
        console.error("Error requesting device orientation permission", error);
      }
    } else {
      // Non-iOS 13+ devices typically don't require explicit permission
      setOrientationPermission(true);
    }
    
    setHasStarted(true);
    // Audio triggering can be safely added here because we are in a user-initiated event handler
  };

  return (
    <>
      <AnimatePresence>
        {!hasStarted && (
          <Preloader 
            key="preloader" 
            onLoaded={() => setIsLoaded(true)} 
            isLoaded={isLoaded}
            onStart={handleStart} 
          />
        )}
      </AnimatePresence>

      <InteractiveScene hasStarted={hasStarted} hasOrientationPermission={orientationPermission} />
    </>
  );
}

export default App;
