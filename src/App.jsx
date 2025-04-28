import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TodoPage from './components/TodoPage';
import MyPage from './components/MyPage';
import CreateTodoPage from './components/CreateTodoPage';
import ChatPage from './components/ChatPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('todo');
  const [todoDetails, setTodoDetails] = useState(null);
  
  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  // Function to handle navigation
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };
  
  // Function to start a chat with Todooungi
  const handleStartChat = (details) => {
    setTodoDetails(details);
    setCurrentPage('chat');
  };
  
  // Render the appropriate page based on login status and current page
  const renderPage = () => {
    if (!isLoggedIn) {
      return <LandingPage onLoginSuccess={handleLogin} />;
    }
    
    switch (currentPage) {
      case 'mypage':
        return <MyPage onNavigate={handleNavigation} />;
      case 'createTodo':
        return <CreateTodoPage 
          onNavigate={handleNavigation} 
          onBack={() => handleNavigation('todo')}
          onStartChat={handleStartChat}
        />;
      case 'chat':
        return <ChatPage 
          onBack={() => handleNavigation('todo')}
          todoDetails={todoDetails}
        />;
      case 'todo':
      default:
        return <TodoPage 
          onNavigate={handleNavigation} 
          onCreateTodo={() => handleNavigation('createTodo')}
        />;
    }
  };
  
  return renderPage();
}

export default App;