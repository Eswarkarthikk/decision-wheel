import React, { useState, useRef, useEffect } from 'react';
import useSound from 'use-sound';
import Layout from './components/Layout';
import ContentPage from './components/ContentPage';
import WheelForm from './components/WheelForm';
import DecisionWheel from './components/DecisionWheel';
import { pageContent } from './content/pageContent';

const App = () => {
  const [currentView, setCurrentView] = useState('form');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [wheelOptions, setWheelOptions] = useState([]);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const lastSegmentRef = useRef(null);
  const intervalRef = useRef(null);
  
  const [playTick] = useSound('/tick.mp3', {
    volume: 0.5
  });

  // Watch for segment changes
  useEffect(() => {
    if (!isSpinning || wheelOptions.length === 0) return;

    const anglePerSegment = 360 / wheelOptions.length;
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const currentSegment = Math.floor(normalizedRotation / anglePerSegment);

    if (lastSegmentRef.current !== currentSegment) {
      playTick();
      lastSegmentRef.current = currentSegment;
    }
  }, [currentRotation, isSpinning, wheelOptions.length, playTick]);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    
    const minRotation = 1800;
    const maxRotation = 3600;
    const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation;
    const newRotation = currentRotation + randomRotation;
    
    // Start the rotation
    setCurrentRotation(newRotation);
    
    // Play ticks with decreasing frequency
    let tickCount = 0;
    const maxTicks = 40; // Increased for smoother sound
    
    const playTickWithDelay = () => {
      if (tickCount < maxTicks) {
        playTick();
        tickCount++;
        
        // Start fast and gradually slow down
        let delay;
        if (tickCount < 15) {
          delay = 50;  // Fast at start
        } else if (tickCount < 25) {
          delay = 100; // Medium speed
        } else {
          delay = 150 + (tickCount - 25) * 20; // Gradually slower
        }
        
        intervalRef.current = setTimeout(playTickWithDelay, delay);
      }
    };
    
    // Start playing ticks
    playTickWithDelay();
    
    setTimeout(() => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      setIsSpinning(false);
      
      // Calculate result
      const anglePerSegment = 360 / wheelOptions.length;
      const normalizedRotation = ((newRotation % 360) + 360) % 360;
      const segmentAtTop = Math.floor((360 - normalizedRotation) / anglePerSegment) % wheelOptions.length;
      
      setResult(wheelOptions[segmentAtTop]);
      setShowResult(true);
    }, 4000);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      alert('You need at least 2 options!');
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createWheel = () => {
    if (!question.trim()) {
      alert('Please enter a question!');
      return;
    }
    
    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options!');
      return;
    }
    
    setWheelOptions(validOptions);
    setCurrentView('wheel');
    setShowResult(false);
  };

  const handleBack = () => {
    setCurrentView('form');
    setShowResult(false);
    setCurrentRotation(0);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    lastSegmentRef.current = null;
  };

  const renderContent = () => {
    if (['privacy', 'terms', 'contact'].includes(currentView)) {
      return (
        <ContentPage
          title={pageContent[currentView].title}
          content={pageContent[currentView].content}
          onBack={handleBack}
        />
      );
    }

    if (currentView === 'form') {
      return (
        <WheelForm
          question={question}
          options={options}
          onQuestionChange={setQuestion}
          onOptionChange={updateOption}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onSubmit={createWheel}
        />
      );
    }

    return (
      <DecisionWheel
        question={question}
        wheelOptions={wheelOptions}
        currentRotation={currentRotation}
        isSpinning={isSpinning}
        result={result}
        showResult={showResult}
        onSpin={spinWheel}
        onBack={handleBack}
      />
    );
  };

  return (
    <Layout 
      onNavigate={setCurrentView}
      isNarrow={currentView === 'wheel'}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
