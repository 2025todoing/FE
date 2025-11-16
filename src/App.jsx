import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LandingPage from './components/LandingPage';
import TodoPage from './components/TodoPage';
import MyPage from './components/MyPage';
import CreateTodoPage from './components/CreateTodoPage';
import ChatPage from './components/ChatPage';
import VerifyPage from './components/VerifyPage';
import AuthPage from './components/AuthPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todoDetails, setTodoDetails] = useState(null);
  return (
    <AppRoutes
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      todoDetails={todoDetails}
      setTodoDetails={setTodoDetails}
    />
  );
}

function AppRoutes({ isLoggedIn, setIsLoggedIn, todoDetails, setTodoDetails }) {
  const nav = useNavigate();
  const onLoginSuccess = () => { setIsLoggedIn(true); nav('/app/todo', { replace: true }); };

  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route path="/" element={<LandingPage onLoginSuccess={onLoginSuccess} />} />
          <Route path="/auth" element={<AuthPage onLoginSuccess={onLoginSuccess} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/app/todo" element={
            <TodoPage
                onNavigate={(p, state) => nav(`/app/${p}`, { state })}
              onCreateTodo={() => nav('/app/create')}
            />
          } />
          <Route path="/app/mypage" element={<MyPage onNavigate={(p) => nav(`/app/${p}`)} />} />
          <Route path="/app/create" element={
            <CreateTodoPage
              onNavigate={(p) => nav(`/app/${p}`)}
              onBack={() => nav('/app/todo')}
              onStartChat={(details) => { setTodoDetails(details); nav('/app/chat'); }}
            />
          } />
          <Route path="/app/chat" element={<ChatPage onBack={() => nav('/app/todo')} todoDetails={todoDetails} />} />
            <Route
              path="/app/verify"
              element={
                <VerifyPage
                  onNavigate={(p, state) => nav(`/app/${p}`, { state })}
                />
              }
            />

          <Route path="*" element={<Navigate to="/app/todo" replace />} />
        </>
      )}
    </Routes>
  );
}