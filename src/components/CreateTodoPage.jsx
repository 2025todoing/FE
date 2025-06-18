import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';
import AlertPopup from './AlertPopup';
import { sendChatSetting } from '../api/chat';




// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
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

const FormContainer = styled.div`
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

  padding-bottom: 4rem;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const FormTitle = styled.h2`
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.2rem;
  background: rgba(0, 0, 0, 0.1);
  color: #3A2618;
  border: none;
  border-radius: 50px;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    background: rgba(0, 0, 0, 0.15);
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const FormLabel = styled.label`
  display: block;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.3rem;
  color: #3A2618;
  margin-bottom: 0.8rem;
`;

const DatePickerContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DatePickerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  }
  
  svg {
    color: #4F87FF;
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  max-width: 350px;
  padding: 0.8rem 1.2rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z' fill='%234F87FF'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  }
  
  &:focus {
    outline: none;
    border-color: #4F87FF;
  }
`;

const LevelButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LevelButton = styled.button`
  flex: 1;
  padding: 1rem;
  border-radius: 10px;
  border: none;
  background: ${props => props.selected ? props.bgColor : 'rgba(255, 255, 255, 0.6)'};
  color: ${props => props.selected ? 'white' : '#333'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StartConversationButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  margin-top: 2rem;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.3rem;
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
  
  &:disabled {
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.4);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
    
    &:before {
      display: none;
    }
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

const DatePickerModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
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

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.5rem;
  color: #3A2618;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #777;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #333;
  }
`;

const Calendar = styled.div`
  width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const MonthYearDisplay = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
`;

const CalendarNavButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  
  &:hover {
    color: #4F87FF;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 0.8rem;
  color: #777;
  padding-bottom: 0.5rem;
`;

const Day = styled.button`
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  background: ${props => {
    if (props.selected) return 'linear-gradient(45deg, #4F87FF, #B344E2)';
    if (props.isToday) return 'rgba(255, 214, 0, 0.2)';
    return 'none';
  }};
  color: ${props => {
    if (props.selected) return 'white';
    if (props.inactive) return '#BBB';
    return '#333';
  }};
  font-weight: ${props => (props.selected || props.isToday) ? 'bold' : 'normal'};
  
  &:hover {
    background: ${props => props.selected ? 'linear-gradient(45deg, #4F87FF, #B344E2)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    background: none;
    
    &:hover {
      background: none;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ConfirmButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(79, 135, 255, 0.3);
  }
  
  &:disabled {
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.4);
    cursor: not-allowed;
  }
`;

// CreateTodoPage Component
const CreateTodoPage = ({ onNavigate, onBack, onStartChat }) => {
  // Refs
  const notificationButtonRef = useRef(null);
  
  // States
  const [selectedDate, setSelectedDate] = useState(3); // Index of "Today"
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [datePickerType, setDatePickerType] = useState("start"); // 'start' or 'end'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [isHoveringNotifications, setIsHoveringNotifications] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState([
    { date: 'Apr 28', content: 'You completed your "Evening yoga" task.', unread: true },
    { date: 'Apr 27', content: 'You became friends with Lisa.', unread: true },
    { date: 'Apr 25', content: 'You completed 3 tasks today!', unread: false },
    { date: 'Apr 23', content: 'Tom shared a todo with you.', unread: false },
    { date: 'Apr 21', content: 'You completed your "Send project proposal" task.', unread: false }
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
  
  // Categories list
  const categories = [
    { value: "exercise", label: "Exercise" },
    { value: "study", label: "Study" },
    { value: "work", label: "Work" },
    { value: "hobby", label: "Hobby" },
    { value: "other", label: "Other" }
  ];
  
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
  
  // Format date as string
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Open date picker modal
  const openDatePicker = (type) => {
    setDatePickerType(type);
    setShowDatePickerModal(true);
  };
  
  // Close date picker modal
  const closeDatePicker = () => {
    setShowDatePickerModal(false);
  };
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  // Select a date from the calendar
  const selectDate = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (datePickerType === "start") {
      setStartDate(newDate);
      // If end date is before start date, reset end date
      if (endDate && endDate < newDate) {
        setEndDate(null);
      }
    } else {
      if (startDate && newDate < startDate) {
        // Can't select end date before start date
        return;
      }
      setEndDate(newDate);
    }
  };
  
  // Confirm date selection
  const confirmDateSelection = () => {
    closeDatePicker();
  };
  
  // Build calendar days
  const buildCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };
  
  // Check if day is today
  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };
  
  // Check if day is selected
  const isSelected = (day) => {
    if (!day) return false;
    
    const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (datePickerType === "start" && startDate) {
      return dateToCheck.getTime() === startDate.getTime();
    } else if (datePickerType === "end" && endDate) {
      return dateToCheck.getTime() === endDate.getTime();
    }
    
    return false;
  };
  
  // Check if form is valid
  const isFormValid = () => {
    return startDate && endDate && category && level;
  };
  
  // Get level button color
  const getLevelColor = (levelValue) => {
    switch (levelValue) {
      case "low": return "#4AD66D"; // Green
      case "mid": return "#FFD600"; // Yellow
      case "high": return "#FF5252"; // Red
      default: return "rgba(0, 0, 0, 0.1)";
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
  
  // Handle document click to close notifications
  const handleDocumentClick = (event) => {
    // Don't close notifications popup if clicking on the button
    if (notificationButtonRef.current && notificationButtonRef.current.contains(event.target)) {
      return;
    }
  };
  
  // Add event listener for document click
  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
  
  // Friend selection handler
  const handleFriendSelect = (friendId) => {
    setSelectedFriend(friendId === selectedFriend ? null : friendId);
  };

  const toYMD = (date) => {
    return date.toISOString().slice(0, 10); // "YYYY-MM-DD"
  };
  
 
  //API
const handleStartConversation = async () => {
  const accessToken = localStorage.getItem('accessToken'); 
  if (!accessToken) {
    console.warn("❗ accessToken 없음");
    return;
  }

  try {
    const settingData = {
      category,
      startDate: toYMD(startDate),
      endDate: toYMD(endDate),
      level,
    };

    console.log(settingData)

    const res = await sendChatSetting(settingData, accessToken);

    if (res.isSuccess) {
      console.log('✅ 챗봇 세션 설정 완료:', res);
      // 👉 여기서 대화 페이지로 이동하거나 상태를 업데이트
      onNavigate && onNavigate('chat'); // 예시: chat 페이지로 전환
    } else {
      alert('챗봇 세션 설정 실패: ' + res.message);
    }
  } catch (err) {
    console.error('❌ 챗봇 세션 설정 중 에러 발생:', err);
    alert('서버 오류로 설정을 저장하지 못했어요.');
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
            <AddFriendButton>+</AddFriendButton>
          </FriendList>
          
          <FormContainer>
            <FormHeader>
              <FormTitle>Create Todo with Todoongi</FormTitle>
              <BackButton onClick={onBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                </svg>
                Back to Todos
              </BackButton>
            </FormHeader>
            
            <FormGroup>
              <FormLabel>Select Date Range</FormLabel>
              <DatePickerContainer>
                <DatePickerButton onClick={() => openDatePicker("start")}>
                  <span>{startDate ? formatDate(startDate) : "Select Start Date"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                </DatePickerButton>
                
                <DatePickerButton onClick={() => openDatePicker("end")} disabled={!startDate}>
                  <span>{endDate ? formatDate(endDate) : "Select End Date"}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                </DatePickerButton>
              </DatePickerContainer>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Category</FormLabel>
              <CategorySelect 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </CategorySelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Level</FormLabel>
              <LevelButtonsContainer>
                <LevelButton 
                  selected={level === "low"} 
                  onClick={() => setLevel("low")}
                  bgColor={getLevelColor("low")}
                >
                  Low
                </LevelButton>
                <LevelButton 
                  selected={level === "mid"} 
                  onClick={() => setLevel("mid")}
                  bgColor={getLevelColor("mid")}
                >
                  Mid
                </LevelButton>
                <LevelButton 
                  selected={level === "high"} 
                  onClick={() => setLevel("high")}
                  bgColor={getLevelColor("high")}
                >
                  High
                </LevelButton>
              </LevelButtonsContainer>
            </FormGroup>
            
            <StartConversationButton 
              onClick={handleStartConversation}
              disabled={!isFormValid()}
            >
              Start Conversation with Todoongi
            </StartConversationButton>
          </FormContainer>
        </MainCard>
      </PageContainer>
      
      {/* Date Picker Modal */}
      <ModalOverlay show={showDatePickerModal} onClick={closeDatePicker}>
        <DatePickerModal 
          show={showDatePickerModal} 
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>
              {datePickerType === "start" ? "Select Start Date" : "Select End Date"}
            </ModalTitle>
            <CloseButton onClick={closeDatePicker}>&times;</CloseButton>
          </ModalHeader>
          
          <Calendar>
            <CalendarHeader>
              <CalendarNavButton onClick={prevMonth}>
                &lt;
              </CalendarNavButton>
              <MonthYearDisplay>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </MonthYearDisplay>
              <CalendarNavButton onClick={nextMonth}>
                &gt;
              </CalendarNavButton>
            </CalendarHeader>
            
            <DaysGrid>
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <DayHeader key={index}>{day}</DayHeader>
              ))}
              
              {/* Calendar days */}
              {buildCalendarDays().map((day, index) => (
                <Day 
                  key={index}
                  selected={isSelected(day)}
                  isToday={isToday(day)}
                  inactive={day === null}
                  onClick={() => day && selectDate(day)}
                  disabled={day === null || (datePickerType === "end" && startDate && new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < startDate)}
                >
                  {day}
                </Day>
              ))}
            </DaysGrid>
          </Calendar>
          
          <ButtonGroup>
            <ConfirmButton 
              onClick={confirmDateSelection}
              disabled={(datePickerType === "start" && !startDate) || (datePickerType === "end" && !endDate)}
            >
              Confirm
            </ConfirmButton>
          </ButtonGroup>
        </DatePickerModal>
      </ModalOverlay>
    </>
  );
};

export default CreateTodoPage;