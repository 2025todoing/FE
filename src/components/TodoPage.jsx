import React, { useState, useEffect, useRef } from 'react';
import AlertPopup from './AlertPopup';
import styled, { keyframes, css } from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';
import { createTodo, fetchTodosByDate, updateTodo, toggleTodo, deleteTodo } from '../api/todo';
import { getFriendTodos, getfriends, addFriends } from '../api/friend';

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

const floating = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const scaleUp = keyframes`
  from { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
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
  height: 85vh;
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
  
  ${props => props.hasNotification && `
    color: #FF5252;
    position: relative;
    
    &:before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: #FF5252;
      border-radius: 50%;
      top: 4px;
      right: 8px;
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
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateY(20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 1.2s forwards;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(180, 180, 180, 0.6);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
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

const TodoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 100px; /* Space for floating button */
`;

const CategorySection = styled.div`
  margin-bottom: 1rem;
`;

const CategoryHeading = styled.h3`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.4rem;
  color: #3A2618;
  margin: 0.5rem 0;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    width: 30%;
    height: 2px;
    background-color: ${props => {
      switch(props.type) {
        case 'Exercise': return '#FF5252';
        case 'Study': return '#4F87FF';
        case 'Work': return '#FFD600';
        case 'Hobby': return '#4AD66D';
        default: return '#B344E2';
      }
    }};
    bottom: -5px;
    left: 0;
    border-radius: 3px;
  }
`;

const CategoryTodos = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
`;

const TodoItem = styled.li`
  display: flex;
  align-items: center;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 14px;
  margin-bottom: 0.8rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.3s ease forwards;
  animation-delay: ${props => props.index * 0.05}s;
  opacity: 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  
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
  width: 100%;
`;

const TodoEditInput = styled.input`
  width: 100%;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #4F87FF;
  background: rgba(255, 255, 255, 0.8);
  outline: none;
  box-shadow: 0 2px 10px rgba(79, 135, 255, 0.2);
  transition: all 0.2s ease;
  
  &:focus {
    box-shadow: 0 3px 15px rgba(79, 135, 255, 0.3);
    border-color: #B344E2;
  }
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

const FloatingAddButton = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  animation: ${floating} 3s ease-in-out infinite;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ContextMenu = styled.div`
  position: fixed;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease forwards;
`;

const ContextMenuItem = styled.div`
  padding: 0.8rem 1.2rem;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${props => props.delete ? '#FF5252' : '#4F87FF'};
  }
  
  svg {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  
  ${props => props.show && `
    opacity: 1;
    visibility: visible;
  `}
`;

const AddTodoForm = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  
  ${props => props.show && css`
    opacity: 1;
    visibility: visible;
    animation: ${scaleUp} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 30px;
    z-index: -1;
    background: linear-gradient(45deg, 
      #FF5252, #4F87FF, #FFD600, #4AD66D, 
      #B344E2
    );
    opacity: 0.3;
    filter: blur(15px);
  }
`;

const AddTodoTitle = styled.h3`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.8rem;
  color: #3A2618;
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const InputLabel = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
`;

const CategorySelector = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const CategoryButton = styled.button`
  padding: 0.6rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? props.bgColor : 'rgba(0, 0, 0, 0.06)'};
  color: ${props => props.selected ? 'white' : '#333'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
`;

const TodoInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  font-family: 'Nunito', sans-serif;
  resize: none;
  min-height: 100px;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #4F87FF;
    box-shadow: 0 0 0 2px rgba(79, 135, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const FormButton = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CancelButton = styled(FormButton)`
  background-color: rgba(0, 0, 0, 0.1);
  color: #333;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

const SubmitButton = styled(FormButton)`
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  box-shadow: 0 4px 15px rgba(79, 135, 255, 0.3);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(79, 135, 255, 0.4);
  }
  
  &:disabled {
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.4);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const CheckboxLabel = styled.label`
  margin-left: 0.5rem;
  cursor: pointer;
  user-select: none;
`;

const AiVerificationCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

// Component
const TodoPage = ({ onNavigate, onCreateTodo }) => {
  // States
  const [selectedDate, setSelectedDate] = useState(3);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddTodoPopup, setShowAddTodoPopup] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState({ visible: false, x: 0, y: 0, todoId: null });
  const [showNotifications, setShowNotifications] = useState(false);
  const [isHoveringNotifications, setIsHoveringNotifications] = useState(false);
  const notificationButtonRef = useRef(null);
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    { date: 'Apr 28', content: 'You completed your "Evening yoga" task.', unread: true },
    { date: 'Apr 27', content: 'You became friends with Lisa.', unread: true },
    { date: 'Apr 25', content: 'You completed 3 tasks today!', unread: false },
    { date: 'Apr 23', content: 'Tom shared a todo with you.', unread: false },
    { date: 'Apr 21', content: 'You completed your "Send project proposal" task.', unread: false }
  ]);
  const [newTodo, setNewTodo] = useState({ 
    category: 'Exercise', 
    text: '', 
    aiVerification: false,
    date: new Date().toISOString().split('T')[0]
  });
  const [categories] = useState(['Exercise', 'Study', 'Work', 'Hobby', 'Other']);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmailInput, setFriendEmailInput] = useState('');
  
  // Sample friends data with their todos
  const [friends, setFriends] = useState([]);

  const [myTodos, setMyTodos] = useState([
    { 
      id: 1, 
      category: 'Exercise', 
      text: 'Go for a 5km run', 
      completed: false, 
      aiVerification: true, 
      verificationMethod: 'GPS 위치 인증',
      date: '2024-04-25'
    },
    { 
      id: 2, 
      category: 'Study', 
      text: 'Complete React assignment', 
      completed: false, 
      aiVerification: false,
      date: '2024-04-25'
    },
    { 
      id: 3, 
      category: 'Study', 
      text: 'Review lecture notes', 
      completed: false, 
      aiVerification: false,
      date: '2024-04-24'
    },
    { 
      id: 4, 
      category: 'Hobby', 
      text: 'Practice guitar for 30 minutes', 
      completed: true, 
      aiVerification: false,
      date: '2024-04-26'
    },
    { 
      id: 5, 
      category: 'Hobby', 
      text: 'Draw sketches', 
      completed: false, 
      aiVerification: false,
      date: '2024-04-25'
    },
    { 
      id: 6, 
      category: 'Work', 
      text: 'Client meeting at 2pm', 
      completed: false, 
      aiVerification: true, 
      verificationMethod: '사진 인증',
      date: '2024-04-26'
    },
    { 
      id: 7, 
      category: 'Work', 
      text: 'Send project proposal', 
      completed: true, 
      aiVerification: false,
      date: '2024-04-23'
    },
    { 
      id: 8, 
      category: 'Exercise', 
      text: 'Evening yoga', 
      completed: false, 
      aiVerification: false,
      date: '2024-04-25'
    }
  ]);

  // 현재 보여줄 todos 결정
  const currentTodos = selectedFriend 
    ? friends.find(f => f.id === selectedFriend)?.todos || []
    : myTodos;
  
  // 날짜 관련 유틸리티 함수들
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getDateFromIndex = (index) => {
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() - (3 - index));
    return formatDate(date);
  };

  // 현재 선택된 날짜의 투두 리스트만 필터링
  const filteredTodos = currentTodos.filter(todo => 
    todo.date === getDateFromIndex(selectedDate)
  );
  
  // Group todos by category
  const groupedTodos = filteredTodos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {});
  
  // Sample dates for the date selector
  const dates = (() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (3 - i)); // 3은 "Today"의 인덱스
      return {
        day: i === 3 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate().toString(),
        fullDate: formatDate(date)
      };
    });
  })();
  
  // Handle todo completion (내 투두만 체크 가능)
  const handleTodoComplete = async (id) => {
    if (selectedFriend) return;

    const todo = myTodos.find(todo => todo.id === id);
    if (!todo || todo.aiVerification) return;

    const accessToken = localStorage.getItem('accessToken'); // ✅ 직접 불러오기
    if (!accessToken) {
      console.warn("❗ accessToken 없음");
      return;
    }

    try {
      const response = await toggleTodo(id, accessToken); // ✅ 호출
      console.log("✅ 토글 성공 응답:", response);

      setMyTodos(prevTodos =>
        prevTodos.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      console.error('❌ TOGO 토글 실패:', err.response || err);
    }
  };
  
  // Handle todo context menu
  const handleTodoContextMenu = (e, todoId) => {
    e.preventDefault();
    setShowContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      todoId
    });
  };

  // 백은 labelName으로 reutnr이어서 바꾸는 함수
  const formatLabel = (label) =>
    label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  
  // Handle document click to hide context menu
  const handleDocumentClick = (event) => {
    if (showContextMenu.visible) {
      setShowContextMenu({ ...showContextMenu, visible: false });
    }
    
    // Don't close notifications popup if clicking on the button
    if (notificationButtonRef.current && notificationButtonRef.current.contains(event.target)) {
      return;
    }
  };
  
  // Delete todo
  const handleDeleteTodo = async (id) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await deleteTodo(id, accessToken);
      if (response.isSuccess && response.code === 'COMMON200') {
        setMyTodos(prev => prev.filter(todo => todo.id !== id)); // 프론트에서도 제거
      } else {
        console.error('삭제 실패:', response.message);
        alert(response.message || "삭제 실패");
      }
    } catch (error) {
      console.error('❌ 삭제 오류:', error.response || error);
      alert(
        error.response?.data?.message ||
        "서버 오류로 삭제에 실패했습니다."
      );
    }

    setShowContextMenu({ ...showContextMenu, visible: false });
  };
  
  // Edit todo inline
  const handleEditTodo = (id) => {
    const todo = myTodos.find(todo => todo.id === id);
    setEditingTodoId(id);
    setEditValue(todo.text);
    setShowContextMenu({ ...showContextMenu, visible: false });
  };
  
  // Save edit
  const handleSaveEdit = async (e, id) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      if (!editValue.trim()) return;

      const todo = myTodos.find(t => t.id === id);
      if (!todo) return;

      const payload = {
        content: editValue,
        date: todo.date,
        labelType: todo.category.toUpperCase(),
      };

      try {
        const accessToken = localStorage.getItem('accessToken');
        await updateTodo(id, payload, accessToken);

        setMyTodos(myTodos.map(todo =>
          todo.id === id ? { ...todo, text: editValue } : todo
        ));
        setEditingTodoId(null);
      } catch (err) {
        console.error('TOGO 수정 실패:', err);
      }
    }
  };

  // Add new friends
  const handleAddFriend = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await addFriends(friendEmailInput, accessToken);
      if (response.isSuccess && response.code === 'COMMON200') {
        alert('친구 요청을 보냈습니다!');
        setShowAddFriend(false);
        setFriendEmailInput('');

        // 친구 목록 새로고침
        const refreshed = await getfriends(accessToken);
        const accepted = refreshed.result
          .filter(f => f.status === 'ACCEPTED')
          .map(f => ({
            id: f.id,
            name: f.friendName,
            color: f.friendColor || '#4F87FF',
            todos: []
          }));
        setFriends(accepted);
      } else {
        alert(response.message || '친구 추가 실패');
      }
    } catch (err) {
      console.error('❌ 친구 추가 실패:', err);
      alert('친구 추가 중 오류 발생');
    }
  };

  
  // Add new todo (내 투두만 추가 가능)
    const handleAddTodo = async () => {
      if (selectedFriend) return;
      if (!newTodo.text.trim()) return;

      const date = getDateFromIndex(selectedDate);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        return;
      }

      const payload = {
        content: newTodo.text,
        todoDate: date,
        labelType: newTodo.category.toUpperCase(),
      };

      try {
        const response = await createTodo(payload, accessToken); // ✅ 여기서 API 함수 호출

        if (response.data.isSuccess && response.data.code === 'COMMON200') {
          const newId = Math.max(...myTodos.map(todo => todo.id), 0) + 1;
          setMyTodos([...myTodos, {
            ...newTodo,
            id: newId,
            date,
            completed: false,
          }]);
          setNewTodo({ category: 'Exercise', text: '', aiVerification: false, date });
          setShowAddTodoPopup(false);
        } else {
          alert(response.data.message || 'TOGO 생성 실패');
        }
      } catch (error) {
        alert('TOGO 생성 중 오류가 발생했습니다.');
        console.error(error);
      }
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
  
  // Reset new todo form when closing
  const handleCloseAddTodoPopup = () => {
    setNewTodo({ category: 'Exercise', text: '', aiVerification: false, date: getDateFromIndex(selectedDate) });
    setShowAddTodoPopup(false);
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    switch(category) {
      case 'Exercise': return '#FF5252';
      case 'Study': return '#4F87FF';
      case 'Work': return '#FFD600';
      case 'Hobby': return '#4AD66D';
      default: return '#B344E2';
    }
  };
  
  // Check if there are unread notifications
  const hasUnreadNotifications = notifications.some(notification => notification.unread);
  
  // Handle notifications button hover
  const handleNotificationsHover = () => {
    setIsHoveringNotifications(true);
    setShowNotifications(true);
  };
  
  // Handle notifications button leave
  const handleNotificationsLeave = () => {
    setIsHoveringNotifications(false);
  };
  
  // Handle notifications button click
  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
  };
  
  // Handle close notifications
  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };
  
  // Add event listener for document click
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showContextMenu.visible]);


  useEffect(() => {
    const fetchTodos = async () => {
      const date = getDateFromIndex(selectedDate);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.warn("❗accessToken 없음: 로그인 필요");
        return;
      }

      try {
        const response = await fetchTodosByDate(date, accessToken); // ✅ 정확히 호출
        console.log("✅ fetchTodosByDate 응답:", response);

        if (response?.isSuccess && response?.code === 'COMMON200') {
          const todos = response.result.map(todo => ({
            id: todo.todoId,
            text: todo.content,
            category: formatLabel(todo.labelName),
            completed: todo.isCompleted,
            aiVerification: todo.isAiNeeded,
            verificationMethod: todo.verificationMethod || '',
            date: todo.todoDate,
          }));
          setMyTodos(todos);
        } else {
          console.error("❌ 실패 응답:", response.message);
        }
      } catch (err) {
        console.error("🚨 fetchTodosByDate 오류:", err);
      }
    };

    fetchTodos();
  }, [selectedDate]);

  useEffect(() => {
    const fetchFriends = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.warn('❗ accessToken 없음: 로그인 필요');
        return;
      }

      try {
        const response = await getfriends(accessToken);
        if (response.isSuccess && response.code === 'COMMON200') {
          const friendList = response.result
            .filter(friend => friend.status === 'ACCEPTED')
            .map(friend => ({
              id: friend.id, // friend.friendId
              name: friend.friendName,
              color: friend.friendColor || '#4F87FF',
              todos: []
            }));
          setFriends(friendList);
        } else {
          console.error('친구 불러오기 실패:', response.message);
        }
      } catch (err) {
        console.error('친구 목록 API 오류:', err.response || err);
      }
    };

    fetchFriends();
  }, []);
  

  // 친구 선택 처리
  const handleFriendSelect = async (friendId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!friendId) {
      console.warn('❗ friendId가 undefined입니다!');
      return;
    }

    // 이미 선택한 친구를 다시 누르면 해제
    if (selectedFriend === friendId) {
      setSelectedFriend(null);
      return;
    }

    setSelectedFriend(friendId);
    setShowAddTodoPopup(false);

    try {
      const response = await getFriendTodos(friendId, accessToken);

      if (response.isSuccess && response.code === 'COMMON200') {
        const todos = response.result.map(todo => ({
          id: todo.todoId,
          text: todo.content,
          category: formatLabel(todo.labelName),
          completed: todo.isCompleted,
          aiVerification: todo.isAiNeeded,
          verificationMethod: todo.verificationMethod || '',
          date: todo.todoDate,
        }));

        // 해당 친구의 todos를 friends 배열에 반영
        setFriends(prev =>
          prev.map(f =>
            f.id === friendId ? { ...f, todos } : f
          )
        );
      } else {
        console.error('❌ 친구 투두 가져오기 실패:', response.message);
      }
    } catch (err) {
      console.error('🚨 친구 투두 API 오류:', err.response || err);
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
              <NavButton 
                ref={notificationButtonRef}
                hasNotification={hasUnreadNotifications}
                onClick={handleNotificationsClick}
                onMouseEnter={handleNotificationsHover}
                onMouseLeave={handleNotificationsLeave}
              >
                Alram
                {showNotifications && (
                  <AlertPopup
                    show={showNotifications}
                    onClose={handleCloseNotifications}
                    isHovering={isHoveringNotifications}
                    notifications={notifications}
                    markAsRead={markAllNotificationsAsRead}
                  />
                )}
              </NavButton>
              <NavButton onClick={() => onNavigate && onNavigate('mypage')}>MyPage</NavButton>
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
                onClick={() => handleFriendSelect(friend.id)}
              >
                {friend.name[0]}
              </FriendAvatar>
            ))}
            <AddFriendButton onClick={() => setShowAddFriend(true)}>+</AddFriendButton>
          </FriendList>
          
          <TodoContainer>
            <TodoHeader>
              <TodoTitle>
                {selectedFriend 
                  ? `${friends.find(f => f.id === selectedFriend)?.name}'s Todos`
                  : 'My Todos'
                }
              </TodoTitle>
              {!selectedFriend && (
                <CreateTodoButton onClick={onCreateTodo}>
                  Create a Todo with Tudung
                  <AddIcon>+</AddIcon>
                </CreateTodoButton>
              )}
            </TodoHeader>
            
            <TodoList>
              {Object.keys(groupedTodos).map(category => (
                <CategorySection key={category}>
                  <CategoryHeading type={category}>
                    {category}
                  </CategoryHeading>
                  <CategoryTodos>
                    {groupedTodos[category].map((todo, index) => (
                      <TodoItem 
                        key={todo.id} 
                        index={index}
                        onContextMenu={(e) => !selectedFriend && handleTodoContextMenu(e, todo.id)}
                      >
                        <Category type={todo.category}>{todo.category}</Category>
                        <TodoContent>
                          {editingTodoId === todo.id ? (
                            <TodoEditInput
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => handleSaveEdit(e, todo.id)}
                              onBlur={(e) => handleSaveEdit(e, todo.id)}
                              autoFocus
                            />
                          ) : (
                            <TodoText aiVerification={todo.aiVerification}>{todo.text}</TodoText>
                          )}
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
                            disabled={selectedFriend || todo.aiVerification}
                            style={{ cursor: (selectedFriend || todo.aiVerification) ? 'not-allowed' : 'pointer' }}
                          />
                        </CheckboxContainer>
                      </TodoItem>
                    ))}
                  </CategoryTodos>
                </CategorySection>
              ))}
            </TodoList>
          </TodoContainer>
          
          {!selectedFriend && (
            <FloatingAddButton onClick={() => setShowAddTodoPopup(true)}>
              +
            </FloatingAddButton>
          )}
        </MainCard>
      </PageContainer>
      
      {/* Context Menu */}
      {showContextMenu.visible && (
        <ContextMenu x={showContextMenu.x} y={showContextMenu.y}>
          <ContextMenuItem onClick={() => handleEditTodo(showContextMenu.todoId)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
            </svg>
            Edit Todo
          </ContextMenuItem>
          <ContextMenuItem delete onClick={() => handleDeleteTodo(showContextMenu.todoId)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
            Delete Todo
          </ContextMenuItem>
        </ContextMenu>
      )}
      
      {/* Add Todo Popup */}
      <ModalOverlay show={showAddTodoPopup} onClick={handleCloseAddTodoPopup}>
        <AddTodoForm 
          show={showAddTodoPopup} 
          onClick={(e) => e.stopPropagation()}
        >
          <AddTodoTitle>
            Create New Todo
          </AddTodoTitle>
          
          <FormGroup>
            <InputLabel>Category</InputLabel>
            <CategorySelector>
              {categories.map(category => (
                <CategoryButton
                  key={category}
                  bgColor={getCategoryColor(category)}
                  selected={newTodo.category === category}
                  onClick={() => setNewTodo({...newTodo, category})}
                >
                  {category}
                </CategoryButton>
              ))}
            </CategorySelector>
          </FormGroup>
          
          <FormGroup>
            <InputLabel>Todo Description</InputLabel>
            <TodoInput
              value={newTodo.text}
              onChange={(e) => setNewTodo({...newTodo, text: e.target.value})}
              placeholder="What do you want to accomplish?"
            />
          </FormGroup>
          
          <CheckboxGroup>
            <AiVerificationCheckbox
              type="checkbox"
              id="aiVerification"
              checked={newTodo.aiVerification}
              onChange={(e) => setNewTodo({...newTodo, aiVerification: e.target.checked})}
            />
            <CheckboxLabel htmlFor="aiVerification">
              Require AI verification
            </CheckboxLabel>
          </CheckboxGroup>
          
          <ButtonGroup>
            <CancelButton onClick={handleCloseAddTodoPopup}>
              Cancel
            </CancelButton>
            <SubmitButton 
              onClick={handleAddTodo}
              disabled={!newTodo.text.trim()}
            >
              Add Todo
            </SubmitButton>
          </ButtonGroup>
        </AddTodoForm>
      </ModalOverlay>
      <ModalOverlay show={showAddFriend} onClick={() => setShowAddFriend(false)}>
        <AddTodoForm show={showAddFriend} onClick={(e) => e.stopPropagation()}>
          <AddTodoTitle>Add Friend</AddTodoTitle>

          <FormGroup>
            <InputLabel>Friends's Email</InputLabel>
            <TodoInput
              value={friendEmailInput}
              onChange={(e) => setFriendEmailInput(e.target.value)}
              placeholder="example@email.com"
            />
          </FormGroup>

          <ButtonGroup>
            <CancelButton onClick={() => setShowAddFriend(false)}>cancel</CancelButton>
            <SubmitButton
              onClick={handleAddFriend}
              disabled={!friendEmailInput.trim()}
            >
              Add
            </SubmitButton>
          </ButtonGroup>
        </AddTodoForm>
      </ModalOverlay>
    </>
  );
};

export default TodoPage;