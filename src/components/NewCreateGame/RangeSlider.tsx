import React from 'react';
import './RangeSlider.scss';

interface RangeSliderProps {
  id: string;
  name: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  id,
  name,
  min,
  max,
  value,
  step = 1,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  // Calculate the percentage for styling the progress bar
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="range-slider">
      <div className="range-slider__track">
        <div 
          className="range-slider__progress" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="range-slider__input"
      />
      <div className="range-slider__markers">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RangeSlider;