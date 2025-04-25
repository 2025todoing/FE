import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TodoPage from './components/TodoPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  return (
    isLoggedIn ? <TodoPage /> : <LandingPage onLoginSuccess={handleLogin} />
  );
}

export default App;