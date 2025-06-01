import React from 'react';
import './WheelForm.css';

const WheelForm = ({
  question,
  options,
  onQuestionChange,
  onOptionChange,
  onAddOption,
  onRemoveOption,
  onSubmit
}) => {
  return (
    <div className="form-section">
      <h1 className="form-title">🎯 Decision Wheel</h1>
      
      <div className="input-group">
        <label className="input-label">What decision do you need help with?</label>
        <input
          type="text"
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          placeholder="e.g., What should I eat for lunch?"
          className="text-input"
        />
      </div>
      
      <div className="input-group">
        <label className="input-label">Your Options:</label>
        <div>
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => onOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="text-input"
              />
              <button
                type="button"
                onClick={() => onRemoveOption(index)}
                className="remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="button-container">
        <button
          type="button"
          onClick={onAddOption}
          className="add-btn"
        >
          + Add Option
        </button>
        
        <button onClick={onSubmit} className="submit-btn">
          Create My Wheel 🎡
        </button>
      </div>
    </div>
  );
};

export default WheelForm; 