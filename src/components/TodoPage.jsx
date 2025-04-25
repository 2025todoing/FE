import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const pageEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: transparent;
  font-family: 'Nunito', sans-serif;
  position: relative;
  z-index: 1;
  padding: 2rem;
  animation: ${pageEnter} 0.8s ease-out forwards;
`;

const MainCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  min-height: 85vh;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out 0.3s forwards;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  background: rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
  transform: translateY(-20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 0.6s forwards;
`;

const Logo = styled.div`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2.2rem;
  color: #3A2618;
  cursor: pointer;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    color: #FF5252;
  }
`;

const NavMenu = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.1rem;
  color: #3A2618;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    color: #FF5252;
    transform: translateY(-2px);
  }
  
  ${props => props.active && `
    color: #FF5252;
    &:after {
      content: '';
      position: absolute;
      width: 60%;
      height: 3px;
      background: #FF5252;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 3px;
    }
  `}
`;

const DateSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  margin-top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transform: translateY(-20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 0.8s forwards;
`;

const DateButton = styled.button`
  background: none;
  border: none;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  padding: 0.6rem;
  margin: 0 0.4rem;
  min-width: 4.2rem;
  cursor: pointer;
  border-radius: 50px;
  transition: all 0.3s ease;
  
  ${props => props.selected ? `
    background: rgba(255, 214, 0, 0.8);
    transform: scale(1.1);
  ` : `
    &:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.05);
    }
  `}
  
  ${props => props.today && !props.selected && `
    font-weight: bold;
    border: 1px dashed #FFD600;
  `}
`;

const DateText = styled.span`
  display: block;
  font-size: 0.9rem;
`;

const DateNumber = styled.span`
  display: block;
  font-size: 1.2rem;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  margin: 0 0.5rem;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const FriendList = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 2.5rem;
  overflow-x: auto;
  background: rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transform: translateY(-20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 1s forwards;
  
  &::-webkit-scrollbar {
    height: 5px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(180, 180, 180, 0.6);
    border-radius: 10px;
  }
`;

const FriendAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.color || '#4F87FF'};
  margin-right: 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  position: relative;
  
  ${props => props.selected && `
    &:before {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: 3px solid #FFD600;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
    }
    transform: scale(1.1);
  `}
  
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(255, 214, 0, 0.7); }
    70% { box-shadow: 0 0 0 6px rgba(255, 214, 0, 0); }
    100% { box-shadow: 0 0 0 0 rgba(255, 214, 0, 0); }
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
`;

const AddFriendButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #777;
  cursor: pointer;
  border: 2px dashed #ddd;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e5e5e5;
    transform: rotate(90deg);
  }
`;

const TodoContainer = styled.div`
  padding: 2.5rem;
  flex-grow: 1;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateY(20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 1.2s forwards;
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const TodoTitle = styled.h2`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2rem;
  color: #3A2618;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    width: 30%;
    height: 3px;
    background: linear-gradient(to right, #FF5252, transparent);
    bottom: -5px;
    left: 0;
    border-radius: 3px;
  }
`;

const CreateTodoButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  border: none;
  border-radius: 50px;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(79, 135, 255, 0.4);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: all 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 25px rgba(79, 135, 255, 0.5);
    
    &:before {
      left: 100%;
    }
  }
`;

const AddIcon = styled.span`
  font-size: 1.5rem;
  margin-left: 0.5rem;
`;

const TodoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TodoItem = styled.li`
  display: flex;
  align-items: center;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.3s ease forwards;
  animation-delay: ${props => props.index * 0.05}s;
  opacity: 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  
  &:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.8);
  }
`;

const Category = styled.div`
  width: 80px;
  text-align: center;
  padding: 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background-color: ${props => {
    switch(props.type) {
      case 'Exercise': return '#FF5252';
      case 'Study': return '#4F87FF';
      case 'Work': return '#FFD600';
      case 'Hobby': return '#4AD66D';
      default: return '#B344E2';
    }
  }};
`;

const TodoContent = styled.div`
  flex-grow: 1;
  padding: 0 1rem;
`;

const TodoText = styled.div`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: ${props => props.aiVerification ? '0.5rem' : '0'};
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:checked {
    background-color: #4AD66D;
    border-color: #4AD66D;
  }
  
  &:checked:after {
    content: '';
    position: absolute;
    top: 25%;
    left: 35%;
    width: 30%;
    height: 50%;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
  
  &:hover {
    border-color: #B344E2;
  }

  &:disabled {
    background-color: #f0f0f0;
    border-color: #ddd;
    cursor: not-allowed;
  }
`;

const AiVerificationTag = styled.div`
  font-size: 0.8rem;
  color: #B344E2;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:before {
    content: '🤖';
    margin-right: 0.3rem;
  }
  
  span {
    text-decoration: underline;
    margin-left: 0.3rem;
    
    &:hover {
      color: #4F87FF;
    }
  }

  &:hover {
    transform: translateY(-1px);
  }
`;

// Shimmer loading effect for initial page load
const ShimmerEffect = styled.div`
  background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
  background-size: 800px 104px;
  border-radius: 5px;
  animation: ${shimmer} 1.5s infinite linear;
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin-bottom: ${props => props.mb || '0'};
`;

// Component
const TodoPage = () => {
  // States
  const [selectedDate, setSelectedDate] = useState(3); // Index of "Today"
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [todos, setTodos] = useState([
    { 
      id: 1, 
      category: 'Exercise', 
      text: 'Go for a 5km run', 
      completed: false, 
      aiVerification: true, 
      verificationMethod: 'GPS 위치 인증'
    },
    { 
      id: 2, 
      category: 'Study', 
      text: 'Complete React assignment', 
      completed: false, 
      aiVerification: false 
    },
    { 
      id: 3, 
      category: 'Hobby', 
      text: 'Practice guitar for 30 minutes', 
      completed: true, 
      aiVerification: false 
    },
    { 
      id: 4, 
      category: 'Work', 
      text: 'Client meeting at 2pm', 
      completed: false, 
      aiVerification: true, 
      verificationMethod: '사진 인증'
    }
  ]);
  
  // Sample dates for the date selector
  const dates = [
    { day: 'Mon', date: '22' },
    { day: 'Tue', date: '23' },
    { day: 'Wed', date: '24' },
    { day: 'Today', date: '25' },
    { day: 'Fri', date: '26' },
    { day: 'Sat', date: '27' },
    { day: 'Sun', date: '28' }
  ];
  
  // Sample friends
  const friends = [
    { id: 1, name: 'Tom', color: '#FF5252' },
    { id: 2, name: 'Lisa', color: '#4F87FF' },
    { id: 3, name: 'Jack', color: '#FFD600' },
    { id: 4, name: 'Emma', color: '#4AD66D' },
    { id: 5, name: 'Mike', color: '#B344E2' }
  ];
  
  // Handle todo completion
  const handleTodoComplete = (id) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo.aiVerification) return; // AI 인증이 필요한 항목은 체크 불가능

    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Scroll dates left
  const scrollDatesLeft = () => {
    if (selectedDate > 0) {
      setSelectedDate(selectedDate - 1);
    }
  };
  
  // Scroll dates right
  const scrollDatesRight = () => {
    if (selectedDate < dates.length - 1) {
      setSelectedDate(selectedDate + 1);
    }
  };

  return (
    <>
      <BackgroundAnimation />
      <PageContainer>
        <MainCard>
          <Header>
            <Logo>Todooungi</Logo>
            <NavMenu>
              <NavButton active>Todos</NavButton>
              <NavButton>Alram</NavButton>
              <NavButton>MyPage</NavButton>
            </NavMenu>
          </Header>
        
          <DateSelector>
            <ArrowButton onClick={scrollDatesLeft}>←</ArrowButton>
            {dates.map((date, index) => (
              <DateButton 
                key={index}
                selected={index === selectedDate}
                today={date.day === 'Today'}
                onClick={() => setSelectedDate(index)}
              >
                <DateText>{date.day}</DateText>
                <DateNumber bold={date.day === 'Today'}>{date.date}</DateNumber>
              </DateButton>
            ))}
            <ArrowButton onClick={scrollDatesRight}>→</ArrowButton>
          </DateSelector>
          
          <FriendList>
            {friends.map(friend => (
              <FriendAvatar 
                key={friend.id}
                color={friend.color}
                selected={selectedFriend === friend.id}
                onClick={() => setSelectedFriend(friend.id === selectedFriend ? null : friend.id)}
              >
                {friend.name[0]}
              </FriendAvatar>
            ))}
            <AddFriendButton>+</AddFriendButton>
          </FriendList>
          
          <TodoContainer>
            <TodoHeader>
              <TodoTitle>Your Todos</TodoTitle>
              <CreateTodoButton>
                Create a Todo with Tudung
                <AddIcon>+</AddIcon>
              </CreateTodoButton>
            </TodoHeader>
            
            <TodoList>
              {todos.map((todo, index) => (
                <TodoItem key={todo.id} index={index}>
                  <Category type={todo.category}>{todo.category}</Category>
                  <TodoContent>
                    <TodoText aiVerification={todo.aiVerification}>{todo.text}</TodoText>
                    {todo.aiVerification && (
                      <AiVerificationTag>
                        AI 인증 방법: {todo.verificationMethod} <span>(인증하러 가기)</span>
                      </AiVerificationTag>
                    )}
                  </TodoContent>
                  <CheckboxContainer>
                    <Checkbox 
                      type="checkbox" 
                      checked={todo.completed}
                      onChange={() => handleTodoComplete(todo.id)}
                      disabled={todo.aiVerification}
                      style={{ cursor: todo.aiVerification ? 'not-allowed' : 'pointer' }}
                    />
                  </CheckboxContainer>
                </TodoItem>
              ))}
            </TodoList>
          </TodoContainer>
        </MainCard>
      </PageContainer>
    </>
  );
};

export default TodoPage;