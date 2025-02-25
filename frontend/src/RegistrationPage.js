import React, { useState } from 'react';
import splash from './splash.png';

const ELEMENT_WIDTH = "400px";  // increased width from 350px to 400px
const ELEMENT_PADDING = "16px";   // increased padding from 14px to 16px

// Dropdown option component with centered text, medium typography, and hover inversion.
const DropdownOption = ({ option, onSelect }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={() => onSelect(option)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: ELEMENT_PADDING,
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        textAlign: 'center',
        backgroundColor: hover ? 'black' : 'white',
        color: hover ? 'white' : 'black',
        fontSize: '16px',
        fontWeight: '500',
        boxSizing: 'border-box'
      }}
    >
      {option}
    </div>
  );
};

// Reusable button that inverts its colors on hover.
// Accepts a fontWeight prop to control the text weight.
const InvertButton = ({ children, initialBg, initialText, onClick, fontWeight }) => {
  const [hover, setHover] = useState(false);
  const bg = hover ? (initialBg === 'black' ? 'white' : 'black') : initialBg;
  const color = hover ? (initialText === 'black' ? 'white' : 'black') : initialText;
  const border = initialBg === 'white'
    ? `1px solid ${hover ? 'white' : 'black'}`
    : (initialBg === 'black' ? (hover ? '1px solid black' : 'none') : 'none');
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      style={{
        width: ELEMENT_WIDTH,
        padding: ELEMENT_PADDING,
        backgroundColor: bg,
        color: color,
        border: border,
        borderRadius: '4px',
        marginBottom: '10px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: fontWeight,
        boxSizing: 'border-box'
      }}
    >
      {children}
    </button>
  );
};

const RegistrationPage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options = [
    'Administrator',
    'Attendee',
    'Organizer',
    'Stakeholder'
  ];
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* Left half with imported splash image and logo */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          backgroundImage: `url(${splash})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Logo in top left corner */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          SEES
        </div>
      </div>

      {/* Right half with white background */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        {/* Header and three-line description */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontWeight: 'bold' }}>WELCOME TO SEES!</h1>
          <p style={{ margin: '10px 0 0 0', fontSize: '16px', lineHeight: '1.5', fontWeight: '500' }}>
            A platform for organizing and managing educational events<br />
            with features like scheduling, attendee management,<br />
            and analytics
          </p>
        </div>

        {/* Input dropdown container */}
        <div style={{ position: 'relative', width: ELEMENT_WIDTH, marginBottom: '30px' }}>
          <input
            type="text"
            readOnly
            value={selectedOption || "Register As"}
            onClick={toggleDropdown}
            style={{
              width: '100%',
              padding: ELEMENT_PADDING,
              paddingRight: "40px", // extra space for arrow
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '500',
              boxSizing: 'border-box'
            }}
          />
          {/* Chevron-style arrow: "∨" when collapsed and "∧" when expanded */}
          <span 
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '16px',
              color: 'black'
            }}
          >
            {isDropdownOpen ? '∧' : '∨'}
          </span>
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ccc',
                zIndex: 1,
                borderRadius: '4px',
                marginTop: '2px',
                boxSizing: 'border-box'
              }}
            >
              {options.map((option) => (
                <DropdownOption
                  key={option}
                  option={option}
                  onSelect={handleOptionSelect}
                />
              ))}
            </div>
          )}
        </div>

        {/* Buttons container */}
        <div style={{ marginBottom: '40px', width: ELEMENT_WIDTH }}>
          <InvertButton initialBg="black" initialText="white" fontWeight="bold" onClick={() => {}}>
            Continue
          </InvertButton>
          <InvertButton initialBg="white" initialText="black" fontWeight="500" onClick={() => {}}>
            Continue as Guest
          </InvertButton>
        </div>

        {/* Additional text beneath the buttons */}
        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '16px', fontWeight: '500' }}>
          Already have an account? <strong style={{ fontWeight: 'bold' }}>LOG IN</strong>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
