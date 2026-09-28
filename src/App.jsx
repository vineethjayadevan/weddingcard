import React, { useState } from 'react';
import Preloader from './components/Preloader/Preloader';
import InteractiveScene from './components/InteractiveScene/InteractiveScene';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    // Audio triggering can be added here later
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

      <InteractiveScene hasStarted={hasStarted} />
    </>
  );
}

export default App;
