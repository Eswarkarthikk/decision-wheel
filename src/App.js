import React, { useState, useEffect, useRef } from 'react';

const DecisionWheel = () => {
  const [currentView, setCurrentView] = useState('form');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [wheelOptions, setWheelOptions] = useState([]);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const tickIntervalRef = useRef(null);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', 
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A24', '#0ABDE3', '#FD79A8', '#FDCB6E'
  ];

  // Create tick sound using Web Audio API
  const createTickSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1000;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch (e) {
      // Silent fallback if audio context fails
    }
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

  const startTickingSound = () => {
    let tickCount = 0;
    const totalTicks = 40;
    let currentInterval = 50;
    
    const tick = () => {
      if (tickCount < totalTicks && isSpinning) {
        createTickSound();
        tickCount++;
        currentInterval += 2;
        tickIntervalRef.current = setTimeout(tick, currentInterval);
      }
    };
    
    tick();
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

  const goBack = () => {
    setCurrentView('form');
    setShowResult(false);
    setCurrentRotation(0);
    stopTickingSound();
  };

  const buildWheelSegments = () => {
    const centerX = 200;
    const centerY = 200;
    const radius = 180;
    const anglePerSegment = (2 * Math.PI) / wheelOptions.length;
    
    return wheelOptions.map((option, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;
      
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = anglePerSegment > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${centerX} ${centerY}`,
        'Z'
      ].join(' ');
      
      // Text positioning
      const textAngle = startAngle + anglePerSegment / 2;
      const textRadius = radius * 0.7;
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);
      const rotationAngle = (textAngle * 180 / Math.PI);
      
      // Handle text rotation and content
      const maxLength = Math.max(8, 20 - wheelOptions.length);
      const displayText = option.length > maxLength ? option.substring(0, maxLength) + '...' : option;
      
      return (
        <g key={index}>
          <path
            d={pathData}
            fill={colors[index % colors.length]}
            stroke="#333"
            strokeWidth="2"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontWeight="bold"
            fontSize={Math.min(14, 300 / wheelOptions.length)}
            stroke="#333"
            strokeWidth="0.5"
            paintOrder="stroke fill"
            transform={`rotate(${rotationAngle > 90 && rotationAngle < 270 ? rotationAngle + 180 : rotationAngle} ${textX} ${textY})`}
          >
            {displayText}
          </text>
        </g>
      );
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTickingSound();
    };
  }, []);

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
    },
    container: {
      width: '100%',
      maxWidth: 'min(500px, 95vw)',
      textAlign: 'center',
    },
    formSection: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      padding: 'clamp(20px, 4vw, 30px)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      margin: '10px',
    },
    title: {
      color: '#333',
      marginBottom: '30px',
      fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
      fontWeight: 700,
      margin: '0 0 30px 0',
    },
    questionDisplay: {
      color: 'white',
      fontSize: 'clamp(1.2rem, 3vw, 2rem)',
      marginBottom: '20px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
      fontWeight: 600,
      padding: '0 10px',
      wordBreak: 'break-word',
    },
    inputGroup: {
      marginBottom: 'clamp(15px, 3vw, 25px)',
      textAlign: 'left',
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: 600,
      color: '#333',
      fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
    },
    input: {
      width: '100%',
      padding: 'clamp(12px, 3vw, 15px)',
      border: '2px solid #e0e0e0',
      borderRadius: '10px',
      fontSize: 'clamp(0.85rem, 2vw, 1rem)',
      transition: 'all 0.3s ease',
      background: 'white',
      boxSizing: 'border-box',
    },
    optionInput: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
      gap: '8px',
    },
    removeBtn: {
      background: '#ff4757',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: 'clamp(28px, 6vw, 35px)',
      height: 'clamp(28px, 6vw, 35px)',
      cursor: 'pointer',
      fontSize: 'clamp(14px, 3vw, 18px)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    addBtn: {
      background: '#2ed573',
      color: 'white',
      border: 'none',
      padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 4vw, 25px)',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: 'clamp(0.85rem, 2vw, 1rem)',
      marginTop: '8px',
      transition: 'all 0.3s ease',
      fontWeight: 600,
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: 'clamp(15px, 3vw, 18px) clamp(30px, 6vw, 40px)',
      borderRadius: '50px',
      cursor: 'pointer',
      fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
      fontWeight: 700,
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)',
      marginTop: '10px',
    },
    wheelContainer: {
      position: 'relative',
      width: 'min(350px, 85vw)',
      height: 'min(350px, 85vw)',
      margin: '15px auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    wheelSvg: {
      width: '100%',
      height: '100%',
      transition: 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)',
      filter: 'drop-shadow(0 0 10px rgba(55, 39, 226, 0.3))',
      transform: `rotate(${currentRotation}deg)`,
    },
    spinBtn: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'clamp(60px, 15vw, 80px)',
      height: 'clamp(60px, 15vw, 80px)',
      background: '#fff',
      borderRadius: '50%',
      zIndex: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase',
      fontWeight: 600,
      color: '#333',
      letterSpacing: '.1em',
      border: '4px solid rgba(81, 223, 255, 0.75)',
      cursor: isSpinning ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
      transition: 'all 0.3s ease',
      opacity: isSpinning ? 0.7 : 1,
    },
    resultDisplay: {
      margin: '20px auto',
      padding: 'clamp(15px, 3vw, 20px)',
      maxWidth: 'min(400px, 90vw)',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(73, 173, 255, 0.1)',
      opacity: showResult ? 1 : 0,
      transform: showResult ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.5s ease',
    },
    resultText: {
      fontSize: 'clamp(1.1rem, 2.8vw, 1.4rem)',
      color: '#333',
      fontWeight: 600,
      marginBottom: '8px',
    },
    resultOption: {
      fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
      color: '#667eea',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      wordBreak: 'break-word',
      lineHeight: 1.2,
    },
    backBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: '2px solid white',
      padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 4vw, 25px)',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
      marginTop: '15px',
      transition: 'all 0.3s ease',
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        {currentView === 'form' ? (
          <div style={styles.formSection}>
            <h1 style={styles.title}>🎯 Decision Wheel</h1>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>What decision do you need help with?</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What should I eat for lunch?"
                style={styles.input}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Your Options:</label>
              <div>
                {options.map((option, index) => (
                  <div key={index} style={styles.optionInput}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      style={{...styles.input, marginBottom: 0}}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      style={styles.removeBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                style={styles.addBtn}
              >
                + Add Option
              </button>
            </div>
            
            <button onClick={createWheel} style={styles.submitBtn}>
              Create My Wheel 🎡
            </button>
          </div>
        ) : (
          <div>
            <div style={styles.questionDisplay}>{question}</div>
            
            <div style={styles.wheelContainer}>
              <svg
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid meet"
                style={styles.wheelSvg}
              >
                <g>{buildWheelSegments()}</g>
              </svg>
              
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                style={styles.spinBtn}
              >
                {isSpinning ? 'SPINNING...' : 'SPIN!'}
              </button>
              
              {/* Pointer */}
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(50% - clamp(30px, 8vw, 40px))',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'clamp(15px, 4vw, 20px)',
                  height: 'clamp(42px, 6vw, 30px)',
                  background: '#fff',
                  clipPath: 'polygon(50% 0%, 15% 100%, 85% 100%)',
                  border: '2px solid #333',
                  borderBottom: 'none',
                  zIndex: 5,
                }}
              />
            </div>
            
            <div style={styles.resultDisplay}>
              <div style={styles.resultText}>🎉 Your choice is:</div>
              <div style={styles.resultOption}>{result}</div>
            </div>
            
            <button onClick={goBack} style={styles.backBtn}>
              ← Create New Wheel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionWheel;