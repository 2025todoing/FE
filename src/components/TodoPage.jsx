import React, { useState, useEffect } from 'react';
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
  
  ${props => props.show && `
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
  font-weight: bold;
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
  font-weight: bold;
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
const TodoPage = () => {
  // States
  const [selectedDate, setSelectedDate] = useState(3); // Index of "Today"
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [showAddTodoPopup, setShowAddTodoPopup] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState({ visible: false, x: 0, y: 0, todoId: null });
  const [newTodo, setNewTodo] = useState({ category: 'Exercise', text: '', aiVerification: false });
  const [categories] = useState(['Exercise', 'Study', 'Work', 'Hobby', 'Other']);
  
  const [todos, setTodos] = useState([
    { id: 1, category: 'Exercise', text: 'Go for a 5km run', completed: false, aiVerification: true, verificationMethod: 'GPS 위치 인증' },
    { id: 2, category: 'Study', text: 'Complete React assignment', completed: false, aiVerification: false },
    { id: 3, category: 'Study', text: 'Review lecture notes', completed: false, aiVerification: false },
    { id: 4, category: 'Hobby', text: 'Practice guitar for 30 minutes', completed: true, aiVerification: false },
    { id: 5, category: 'Hobby', text: 'Draw sketches', completed: false, aiVerification: false },
    { id: 6, category: 'Work', text: 'Client meeting at 2pm', completed: false, aiVerification: true, verificationMethod: '사진 인증' },
    { id: 7, category: 'Work', text: 'Send project proposal', completed: true, aiVerification: false },
    { id: 8, category: 'Exercise', text: 'Evening yoga', completed: false, aiVerification: false }
  ]);
  
  // Group todos by category
  const groupedTodos = todos.reduce((acc, todo) => {
    if (!acc[todo.category]) {
      acc[todo.category] = [];
    }
    acc[todo.category].push(todo);
    return acc;
  }, {});
  
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
  
  // Handle document click to hide context menu
  const handleDocumentClick = () => {
    if (showContextMenu.visible) {
      setShowContextMenu({ ...showContextMenu, visible: false });
    }
  };
  
  // Delete todo
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setShowContextMenu({ ...showContextMenu, visible: false });
  };
  
  // Edit todo
  const handleEditTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    setNewTodo({ 
      category: todo.category, 
      text: todo.text, 
      aiVerification: todo.aiVerification,
      id // Store the id for updating
    });
    setShowAddTodoPopup(true);
    setShowContextMenu({ ...showContextMenu, visible: false });
  };
  
  // Add or update todo
  const handleAddTodo = () => {
    if (newTodo.text.trim()) {
      if (newTodo.id) {
        // Update existing todo
        setTodos(todos.map(todo => 
          todo.id === newTodo.id 
            ? { ...todo, category: newTodo.category, text: newTodo.text, aiVerification: newTodo.aiVerification } 
            : todo
        ));
      } else {
        // Add new todo
        const newId = Math.max(...todos.map(todo => todo.id), 0) + 1;
        setTodos([...todos, { 
          ...newTodo, 
          id: newId, 
          completed: false,
          verificationMethod: newTodo.aiVerification ? '위치 인증' : undefined
        }]);
      }
      
      // Reset form and close popup
      setNewTodo({ category: 'Exercise', text: '', aiVerification: false });
      setShowAddTodoPopup(false);
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
    setNewTodo({ category: 'Exercise', text: '', aiVerification: false });
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
  
  // Add event listener for document click
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showContextMenu.visible]);

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
              <CreateTodoButton onClick={() => setShowAddTodoPopup(true)}>
                Create a Todo with Tudung
                <AddIcon>+</AddIcon>
              </CreateTodoButton>
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
                        onContextMenu={(e) => handleTodoContextMenu(e, todo.id)}
                      >
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
                  </CategoryTodos>
                </CategorySection>
              ))}
            </TodoList>
          </TodoContainer>
          
          <FloatingAddButton onClick={() => setShowAddTodoPopup(true)}>
            +
          </FloatingAddButton>
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
            {newTodo.id ? 'Edit Todo' : 'Create New Todo'}
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
              {newTodo.id ? 'Update' : 'Add Todo'}
            </SubmitButton>
          </ButtonGroup>
        </AddTodoForm>
      </ModalOverlay>
    </>
  );
};

export default TodoPage;