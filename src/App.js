import React, { useState, useEffect, useRef } from 'react';
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
  const tickIntervalRef = useRef(null);

  // Initialize audio context
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    return () => {
      if (context) {
        context.close();
      }
    };
  }, []);

  const playTickSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.type = 'square';
      oscillator.frequency.value = 2000;
      gainNode.gain.value = 0.5;

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        context.close();
      }, 50);

    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const startTickingSound = () => {
    playTickSound();
    
    let tickCount = 0;
    const tick = () => {
      if (tickCount < 20 && isSpinning) {
        playTickSound();
        tickCount++;
        const delay = Math.min(100 + (tickCount * 10), 300);
        tickIntervalRef.current = setTimeout(tick, delay);
      }
    };

    setTimeout(tick, 100);
  };

  const stopTickingSound = () => {
    if (tickIntervalRef.current) {
      clearTimeout(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    
    const minRotation = 1800;
    const maxRotation = 3600;
    const randomRotation = Math.random() * (maxRotation - minRotation) + minRotation;
    
    const newRotation = currentRotation + randomRotation;
    setCurrentRotation(newRotation);
    
    startTickingSound();
    
    setTimeout(() => {
      stopTickingSound();
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
    stopTickingSound();
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
