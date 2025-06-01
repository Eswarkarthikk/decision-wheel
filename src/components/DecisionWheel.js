import React from 'react';
import './DecisionWheel.css';

const DecisionWheel = ({ 
  question, 
  wheelOptions, 
  currentRotation, 
  isSpinning, 
  result, 
  showResult, 
  onSpin, 
  onBack 
}) => {
  // Define metallic gradients for each color
  const colors = [
    { main: '#ffb347', gradient: ['#ffc875', '#ffb347', '#ff9914'] }, // light orange
    { main: '#3389b6', gradient: ['#4aa1cf', '#3389b6', '#276a8f'] }, // metallic blue
    { main: '#0047AB', gradient: ['#1a6ac7', '#0047AB', '#003380'] }, // cobalt blue
    { main: '#2ecc71', gradient: ['#55e08c', '#2ecc71', '#27ae60'] }, // emerald green
    { main: '#9b59b6', gradient: ['#b07cc6', '#9b59b6', '#8e44ad'] }, // amethyst purple
    { main: '#e74c3c', gradient: ['#f76d5e', '#e74c3c', '#c0392b'] }, // ruby red
    { main: '#f1c40f', gradient: ['#f7d83d', '#f1c40f', '#d4ac0d'] }, // golden yellow
    
    { main: '#1abc9c', gradient: ['#40d9b8', '#1abc9c', '#16a085'] }, // turquoise
    
   
    { main: '#ffbb91', gradient: ['#ffd4b8', '#ffbb91', '#ffa16a'] }, // peach
    { main: '#8c52ff', gradient: ['#a47aff', '#8c52ff', '#6b3fc2'] }, // bright purple
    { main: '#d95483', gradient: ['#e87aa0', '#d95483', '#b6446c'] }  // rose pink
  ];

  const buildWheelSegments = () => {
    const centerX = 200;
    const centerY = 200;
    const radius = 190;  // Slightly smaller to accommodate borders
    const anglePerSegment = (2 * Math.PI) / wheelOptions.length;
    
    return (
      <g>
        <defs>
          {colors.map((color, i) => (
            <radialGradient
              key={`gradient-${i}`}
              id={`metallic-${i}`}
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor={color.gradient[0]} />
              <stop offset="50%" stopColor={color.gradient[1]} />
              <stop offset="100%" stopColor={color.gradient[2]} />
            </radialGradient>
          ))}
        </defs>
        {wheelOptions.map((option, index) => {
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
          
          const textAngle = startAngle + anglePerSegment / 2;
          const textRadius = radius * 0.6;
          const textX = centerX + textRadius * Math.cos(textAngle);
          const textY = centerY + textRadius * Math.sin(textAngle);
          const rotationAngle = (textAngle * 180 / Math.PI);
          
          return (
            <g key={index}>
              <path
                d={pathData}
                fill={`url(#metallic-${index % colors.length})`}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontWeight="700"
                fontSize="18"
                transform={`rotate(${rotationAngle > 90 && rotationAngle < 270 ? rotationAngle + 180 : rotationAngle} ${textX} ${textY})`}
                style={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7), -1px -1px 1px rgba(0,0,0,0.5)',
                  letterSpacing: '0.5px'
                }}
              >
                {option}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <div>
      <div className="question-display">{question}</div>
      
      <div className="wheel-container">
        <svg
          viewBox="0 0 400 400"
          className="wheel-svg"
          style={{ transform: `rotate(${currentRotation}deg)` }}
        >
          <defs>
            <linearGradient id="metallic-border" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#daa520" />
              <stop offset="100%" stopColor="#b8860b" />
            </linearGradient>
          </defs>
          {buildWheelSegments()}
          {/* Inner white border */}
          <circle 
            cx="200" 
            cy="200" 
            r="190" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="5"
          />
          {/* Outer gold border */}
          <circle 
            cx="200" 
            cy="200" 
            r="195" 
            fill="none" 
            stroke="#FFD700"
            strokeWidth="5"
          />
        </svg>
        
        <div 
          className={`spin-btn-container ${isSpinning ? 'disabled' : ''}`}
          onClick={!isSpinning ? onSpin : undefined}
        >
          <div className="wheel-needle" />
          <button
            disabled={isSpinning}
            className="spin-btn"
          >
            {isSpinning ? 'SPIN' : 'SPIN!'}
          </button>
        </div>
      </div>
      
      <div className={`result-display ${showResult ? 'show' : ''}`}>
        <div className="result-text">🎉 Your choice is:</div>
        <div className="result-option">{result}</div>
      </div>
      
      <button onClick={onBack} className="back-button">
        ← Create New Wheel
      </button>
    </div>
  );
};

export default DecisionWheel; 