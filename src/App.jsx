import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TodoPage from './components/TodoPage';
import MyPage from './components/MyPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('todo');
  
  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  // Function to handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };
  
  // Render the appropriate page based on login status and current page
  const renderPage = () => {
    if (!isLoggedIn) {
      return <LandingPage onLoginSuccess={handleLogin} />;
    }
    
    switch (currentPage) {
      case 'mypage':
        return <MyPage onNavigate={handleNavigation} />;
      case 'todo':
      default:
        return <TodoPage onNavigate={handleNavigation} />;
    }
  };
  
  return renderPage();
}

export default App;