import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleUp = keyframes`
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 100% 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const TodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  min-height: 600px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem auto;
  animation: ${fadeIn} 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  
  @media (max-width: 850px) {
    width: 90%;
    margin: 1rem auto;
    padding: 1.5rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 35px;
    z-index: -1;
    background: linear-gradient(45deg, 
      #FF5252, #4F87FF, #FFD600, #4AD66D, 
      #FF8C1A, #B344E2, #FF5252
    );
    opacity: 0.3;
    filter: blur(15px);
  }
`;

const TodoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Logo = styled.h1`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2.5rem;
  color: #3A2618;
  margin: 0;
  
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const UserName = styled.span`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 1rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #FF5252;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
    transform: translateY(-2px);
  }
`;

const TodoForm = styled.form`
  display: flex;
  margin-bottom: 2rem;
  border-radius: 50px;
  overflow: hidden;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 600px) {
    flex-direction: column;
    border-radius: 20px;
    overflow: visible;
  }
`;

const TodoInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: #3A2618;
  
  @media (max-width: 600px) {
    border-radius: 20px 20px 0 0;
    margin-bottom: 0.5rem;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  border: none;
  padding: 1rem 2rem;
  color: white;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #5E96FF, #C355F3);
  }
  
  @media (max-width: 600px) {
    border-radius: 0 0 20px 20px;
    padding: 0.8rem;
    width: 100%;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(45deg, #4F87FF, #B344E2)' : 'white'};
  color: ${props => props.active ? 'white' : '#3A2618'};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, ${props => props.active ? 0.1 : 0.05});
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const TodoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
`;

const TodoItem = styled.li`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: ${scaleUp} 0.3s forwards;
  transform-origin: center;
  position: relative;
  
  ${props => props.completed && css`
    opacity: 0.7;
  `}
  
  &:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -2px;
    top: -2px;
    bottom: -2px;
    width: 5px;
    background: ${props => props.priority === 'high' 
      ? '#FF5252' 
      : props.priority === 'medium' 
        ? '#FFD600' 
        : '#4AD66D'};
    border-radius: 3px 0 0 3px;
  }
`;

const TodoCheckbox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
  border: 2px solid ${props => props.completed ? '#4AD66D' : '#ddd'};
  background: ${props => props.completed ? '#4AD66D' : 'white'};
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4AD66D;
    animation: ${pulse} 1s infinite;
  }
  
  &::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    opacity: ${props => props.completed ? 1 : 0};
    transition: opacity 0.2s ease;
  }
`;

const TodoContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TodoText = styled.span`
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: #3A2618;
  margin-bottom: 0.3rem;
  
  ${props => props.completed && css`
    text-decoration: line-through;
    color: #999;
  `}
`;

const TodoMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #777;
`;

const TodoDate = styled.span`
  display: flex;
  align-items: center;
  
  &::before {
    content: '🗓️';
    margin-right: 0.3rem;
  }
`;

const TodoPriority = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: bold;
  background: ${props => props.priority === 'high' 
    ? 'rgba(255, 82, 82, 0.1)' 
    : props.priority === 'medium'
      ? 'rgba(255, 214, 0, 0.1)'
      : 'rgba(74, 214, 109, 0.1)'};
  color: ${props => props.priority === 'high' 
    ? '#FF5252' 
    : props.priority === 'medium'
      ? '#FFD600'
      : '#4AD66D'};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.delete ? 'rgba(255, 82, 82, 0.1)' : 'rgba(79, 135, 255, 0.1)'};
  color: ${props => props.delete ? '#FF5252' : '#4F87FF'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.delete ? 'rgba(255, 82, 82, 0.2)' : 'rgba(79, 135, 255, 0.2)'};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #999;
  text-align: center;
  height: 300px;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1.5rem;
  opacity: 0.5;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(79, 135, 255, 0.2);
  border-radius: 50%;
  border-top-color: #4F87FF;
  animation: ${rotate} 1s linear infinite;
  margin-right: 0.5rem;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  height: 300px;
`;

const TodoSkeleton = styled.div`
  height: 80px;
  background: #f5f5f5;
  border-radius: 16px;
  margin-bottom: 1rem;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.6) 50%, 
      rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
`;

const TodoApp = ({ username = "User", onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Mock data for initial todos
  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      setTodos([
        {
          id: 1,
          text: "Complete the React project",
          completed: false,
          date: "2025-04-26",
          priority: "high"
        },
        {
          id: 2,
          text: "Read chapter 5 of Design Patterns book",
          completed: true,
          date: "2025-04-25",
          priority: "medium"
        },
        {
          id: 3,
          text: "Go for a 30-minute walk",
          completed: false,
          date: "2025-04-25",
          priority: "low"
        },
        {
          id: 4,
          text: "Call dentist to schedule appointment",
          completed: false,
          date: "2025-04-27",
          priority: "medium"
        }
      ]);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Add new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      date: new Date().toISOString().slice(0, 10),
      priority: "medium" // Default priority
    };
    
    setTodos([newTodoItem, ...todos]);
    setNewTodo('');
  };
  
  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Change todo priority
  const changePriority = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const priorities = ['low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(todo.priority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        return { ...todo, priority: priorities[nextIndex] };
      }
      return todo;
    }));
  };
  
  // Filter todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  // Get first letter of username for avatar
  const avatarInitial = username.charAt(0).toUpperCase();
  
  return (
    <TodoContainer>
      <TodoHeader>
        <Logo>Todooungi</Logo>
        <UserInfo>
          <Avatar>{avatarInitial}</Avatar>
          <UserName>{username}</UserName>
          <LogoutButton onClick={onLogout}>Logout</LogoutButton>
        </UserInfo>
      </TodoHeader>
      
      <TodoForm onSubmit={handleAddTodo}>
        <TodoInput 
          type="text" 
          placeholder="What do you need to do today?" 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <AddButton type="submit">Add Todo</AddButton>
      </TodoForm>
      
      <FilterContainer>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterButton>
        <FilterButton 
          active={filter === 'active'} 
          onClick={() => setFilter('active')}
        >
          Active
        </FilterButton>
        <FilterButton 
          active={filter === 'completed'} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </FilterButton>
      </FilterContainer>
      
      {loading ? (
        <LoadingState>
          <LoadingSpinner />
          <p>Loading your todos...</p>
          <TodoSkeleton />
          <TodoSkeleton />
          <TodoSkeleton />
        </LoadingState>
      ) : filteredTodos.length > 0 ? (
        <TodoList>
          {filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              completed={todo.completed}
              priority={todo.priority}
            >
              <TodoCheckbox 
                completed={todo.completed}
                onClick={() => toggleTodo(todo.id)}
              />
              <TodoContent>
                <TodoText completed={todo.completed}>{todo.text}</TodoText>
                <TodoMeta>
                  <TodoDate>{todo.date}</TodoDate>
                  <TodoPriority priority={todo.priority}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </TodoPriority>
                </TodoMeta>
              </TodoContent>
              <ActionButtons>
                <ActionButton onClick={() => changePriority(todo.id)}>
                  🏷️
                </ActionButton>
                <ActionButton delete onClick={() => deleteTodo(todo.id)}>
                  🗑️
                </ActionButton>
              </ActionButtons>
            </TodoItem>
          ))}
        </TodoList>
      ) : (
        <EmptyState>
          <EmptyIcon>📝</EmptyIcon>
          <h3>No todos found</h3>
          <p>
            {filter === 'all' 
              ? "You don't have any tasks yet. Add one above!" 
              : filter === 'active' 
                ? "You don't have any active tasks."
                : "You don't have any completed tasks."}
          </p>
        </EmptyState>
      )}
    </TodoContainer>
  );
};

export default TodoApp;