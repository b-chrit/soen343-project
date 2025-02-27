import React from 'react';
import './App.css';
import Register from './registration';  
import logo from './logo.jpg';  // Import the logo

function App() {
  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />  {/* Render the logo */}
      <Register />  {/* Render the Register component */}
    </div>
  );
}

export default App;
