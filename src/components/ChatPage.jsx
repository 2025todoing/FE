import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import BackgroundAnimation from './BackgroundAnimation';
import { postChatMessage, getChatResult, saveChatPlan } from '../api/chat';
import todoongiImg from '../assets/images/todoi.png';


// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const loadingDots = keyframes`
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const starRotate = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
`;

const starOpacity = keyframes`
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0.2; transform: scale(1); }
`;

const starSparkle = keyframes`
  0% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
  25% { transform: translateY(-30px) translateX(20px) scale(1.2); opacity: 1; }
  50% { transform: translateY(0) translateX(40px) scale(1.4); opacity: 0.8; }
  75% { transform: translateY(30px) translateX(20px) scale(1.2); opacity: 1; }
  100% { transform: translateY(0) translateX(0) scale(0); opacity: 0; }
`;


const popupSlideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translate(-50%, -50%) scale(0.7); 
  }
  to { 
    opacity: 1; 
    transform: translate(-50%, -50%) scale(1); 
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
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
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    background: rgba(0, 0, 0, 0.15);
  }
  
  svg {
    margin-right: 0.5rem;ƒ
    width: 20px;
    height: 20px;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  transform: translateY(20px);
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out 1.2s forwards;
  position: relative;
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scroll-behavior: smooth;
  
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

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 1rem 1.5rem;
  border-radius: ${props => props.$isUser ? '18px 18px 0 18px' : '18px 18px 18px 0'};
  background: ${props => props.$isUser ? 'linear-gradient(45deg, #4F87FF, #B344E2)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.$isUser ? 'right' : 'left'}: 0;
    width: 12px;
    height: 12px;
    background: ${props => props.$isUser ? 'linear-gradient(45deg, #4F87FF, #B344E2)' : 'rgba(255, 255, 255, 0.8)'};
    z-index: -1;
  }
`;
const InputContainer = styled.div`
  display: flex;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4F87FF;
    box-shadow: 0 0 0 2px rgba(79, 135, 255, 0.2);
  }
`;

const SendButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  border: none;
  margin-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background: rgba(0, 0, 0, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const WelcomeTitle = styled.h2`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.8rem;
  color: #3A2618;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 18px;
  margin: 1rem 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  align-self: center;
`;

const LoadingText = styled.span`
  font-size: 1.1rem;
  color: #3A2618;
  margin-right: 1rem;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.3rem;
  
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4F87FF;
    animation: ${loadingDots} 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0; }
  }
`;

const FireworksOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
`;

const CelebrationStar = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  opacity: 1;
  z-index: 1001;
  pointer-events: none;
  
  &:before {
    content: "✦";
    position: absolute;
    color: ${props => props.color || 'gold'};
    font-size: ${props => props.size || '24px'};
    animation: ${starRotate} 2s linear infinite,
               ${starOpacity} 2s ease-in-out infinite,
               ${starSparkle} 3s ease-in-out forwards;
    animation-delay: ${props => props.delay || '0s'};
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.9);
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
  }
`;

const PlanPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const PlanPopup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 2rem;
  animation: ${popupSlideIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  max-height: 80vh;
  overflow-y: auto;
  
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
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(180, 180, 180, 0.5);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 10px;
  }
`;

const PopupTitle = styled.h2`
  font-family: 'SCDream', 'sans-serif';
  font-size: 1.5rem;
  color: #3A2618;
  text-align: center;
  margin: 0 0 1.5rem 0;
  animation: ${bounce} 1s ease-out;
`;

const MainQuest = styled.div`
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: white;
  padding: 1.2rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(79, 135, 255, 0.3);
`;

const MainQuestTitle = styled.h3`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.1rem;
  margin: 0;
  text-align: center;
  font-weight: 600;
`;

const SubQuestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
`;

const SubQuestItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  border-left: 4px solid #FFD600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  }
`;

const QuestDate = styled.div`
  background: #FFD600;
  color: #3A2618;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const QuestTask = styled.div`
  color: #333;
  font-size: 1rem;
  line-height: 1.4;
`;

const PopupButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PopupButton = styled.button`
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const AcceptButton = styled(PopupButton)`
  background: linear-gradient(45deg, #4AD66D, #2196F3);
  color: white;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(74, 214, 109, 0.4);
  }
`;

const RejectButton = styled(PopupButton)`
  background: rgba(255, 82, 82, 0.1);
  color: #FF5252;
  border: 2px solid #FF5252;
  
  &:hover {
    background: #FF5252;
    color: white;
    box-shadow: 0 6px 20px rgba(255, 82, 82, 0.4);
  }
`;

// ChatPage Component
const ChatPage = ({ onBack, todoDetails }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      isUser: false,
      text: `안녕하세요! 저는 투둥이에요. 할 일을 계획하고 정리하는 것을 도와드릴게요. 어떤 것을 도와드릴까요?`
    }
  ]);
  const [isPlanPopupVisible, setIsPlanPopupVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [planData, setPlanData] = useState(null);

  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const [isPolling, setIsPolling] = useState(false);
  const [lastResultId, setLastResultId] = useState(null); // 마지막으로 받은 결과 ID

  // Scroll to bottom of messages when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const startPolling = async () => {
      console.log("📡 폴링 시작");
      const accessToken = localStorage.getItem('accessToken');

      // Mock 모드가 아닐 때만 토큰 체크
      const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
      if (!USE_MOCK && !accessToken) return;

      try {
        const response = await getChatResult(accessToken);
  
        if (response.isSuccess && response.result) {
          const { id, type, content } = response.result;
          const resultText = prompt;
  
          // 새로운 응답인지 확인 (중복 방지)
          if (id && id !== lastResultId) {
            setLastResultId(id);
  
            // JSON 파싱 시도
            if (id && id !== lastResultId) {
              setLastResultId(id);
            
              // PLAN
              if (type === "plan") {

                //  폴링 중단
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                     pollingIntervalRef.current = null;
                }
                const parsed = JSON.parse(content); // content 자체가 JSON 문자열
            
                const loadingMessage = {
                  id: uuidv4(),
                  isUser: false,
                  isLoading: true
                };
                setMessages(prev => [...prev, loadingMessage]);
            
                setTimeout(() => {
                  setMessages(prev => prev.filter(msg => !msg.isLoading));
                  setShowFireworks(true);
            
                  setPlanData({
                    mainQuest: parsed.mainQuest,
                    subQuests: parsed.subQuests
                  });
            
                  setTimeout(() => {
                    setShowFireworks(false);
                    setIsPlanPopupVisible(true);
                  }, 1000);
                }, 2000);
            
                return;
              }
            
              // 일반 response
              if (type === "response") {
                const aiMessage = {
                  id: uuidv4(),
                  isUser: false,
                  text: content
                };
                setMessages(prev => [...prev, aiMessage]);
              }
            }
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };
  
    // 1.5초마다 폴링
    pollingIntervalRef.current = setInterval(startPolling, 700);
  
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [lastResultId]);
  


  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const accessToken = localStorage.getItem('accessToken');
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

    // Mock 모드가 아닐 때만 토큰 체크
    if (!USE_MOCK && !accessToken) {
      console.error('❗ No access token found');
      return;
    }

    const userMessage = message.trim();
    const newMessage = {
      id: uuidv4(),
      isUser: true,
      text: userMessage
    };

    // 화면에 바로 표시
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    try {
      // 서버로 즉시 전송 (디바운스 없음)
      const response = await postChatMessage(userMessage, accessToken);

      if (!response.isSuccess) {
        // 에러 메시지 표시
        const errorMessage = {
          id: uuidv4(),
          isUser: false,
          text: "메시지 전송 중 문제가 발생했어요. 다시 시도해주세요."
        };
        setMessages(prev => [...prev, errorMessage]);
        console.error('Message send error:', response.message);
      }
      // 성공 시 폴링이 자동으로 응답을 가져옴
    } catch (error) {
      const errorMessage = {
        id: uuidv4(),
        isUser: false,
        text: "서버 연결에 문제가 있어요. 잠시 후 다시 시도해주세요."
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Network error:', error);
    }
  };

  // Handle plan acceptance
  const handleAcceptPlan = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

    // Mock 모드가 아닐 때만 토큰 체크
    if (!USE_MOCK && !accessToken) {
      console.error('❗ No access token found');
      return;
    }

    if (!planData) {
      console.error('❗ No plan data available');
      return;
    }

    try {
      // Close popup first
      setIsPlanPopupVisible(false);

      // Show saving message
      const savingMessage = {
        id: uuidv4(),
        isUser: false,
        text: "계획을 저장하고 있어요..."
      };
      setMessages(prev => [...prev, savingMessage]);

      // Prepare data for API
      const planPayload = {
        mainQuest: planData.mainQuest,
        subQuests: planData.subQuests
      };

      // Save plan to API
      const response = await saveChatPlan(planPayload, accessToken);

      // Remove saving message
      setMessages(prev => prev.filter(msg => msg.text !== "계획을 저장하고 있어요..."));

      if (response.isSuccess) {
        // Show success message
        const successMessage = {
          id: uuidv4(),
          isUser: false,
          text: "좋아요! 계획이 저장되었어요. 이제 시작해볼까요? 화이팅이에요! 💪"
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        // Show error message
        const errorMessage = {
          id: uuidv4(),
          isUser: false,
          text: "계획 저장 중 문제가 발생했어요. 다시 시도해주세요."
        };
        setMessages(prev => [...prev, errorMessage]);
        console.error('Plan Save Error:', response.message);
      }

      // Clear plan data
      setPlanData(null);
    } catch (error) {
      // Remove saving message
      setMessages(prev => prev.filter(msg => msg.text !== "계획을 저장하고 있어요..."));

      // Show error message
      const errorMessage = {
        id: uuidv4(),
        isUser: false,
        text: "서버 연결에 문제가 있어 계획을 저장하지 못했어요. 다시 시도해주세요."
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Network Error while saving plan:', error);
      
      // Clear plan data
      setPlanData(null);
    }
  };

  // Handle plan rejection
  const handleRejectPlan = () => {
    setIsPlanPopupVisible(false);

    const rejectMessage = {
      id: uuidv4(),
      isUser: false,
      text: "알겠어요! 다른 계획을 다시 생각해볼게요. 어떤 부분을 바꾸고 싶으신가요?"
    };

    setMessages(prev => [...prev, rejectMessage]);
    setPlanData(null);
  };

  // Generate celebration stars positions
  const generateCelebrationStars = () => {
    const stars = [];
    const colors = ['gold', '#FFD600', '#FF5252', '#4F87FF', '#4AD66D', '#B344E2'];
    const sizes = ['20px', '24px', '28px', '16px'];

    // Create stars in a burst pattern around the popup
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30) * (Math.PI / 180); // 30 degree intervals
      const radius = 150 + Math.random() * 100; // Random radius from center
      const centerX = 50; // Center X percentage
      const centerY = 50; // Center Y percentage

      const x = centerX + (radius * Math.cos(angle) / window.innerWidth) * 100;
      const y = centerY + (radius * Math.sin(angle) / window.innerHeight) * 100;

      stars.push({
        id: i,
        top: Math.max(5, Math.min(95, y)) + '%',
        left: Math.max(5, Math.min(95, x)) + '%',
        color: colors[Math.floor(Math.random() * colors.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        delay: (Math.random() * 0.8) + 's'
      });
    }

    return stars;
  };

  // Handle Enter key press in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <BackgroundAnimation />
      <PageContainer>
        <MainCard>
          <Header>
            <BackButton onClick={onBack}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
              이전으로
            </BackButton>
            <Logo>Todooungi</Logo>
          </Header>

          <ChatContainer>
            <MessagesContainer>
            {messages.length === 1 && (
                <WelcomeMessage>
                  <WelcomeTitle>투둥이와 대화하기</WelcomeTitle>
                <WelcomeText>
                할 일을 계획하고 달성하는 데 도움을 드릴게요. 함께 효과적으로 할 일을 관리해보아요!
                </WelcomeText>
              </WelcomeMessage>
            )}

              {messages.map(msg => {
                if (msg.isLoading) {
                  return (
                    <LoadingMessage key={msg.id}>
                      <LoadingText>잠시만 기다리라냥...</LoadingText>
                      <LoadingDots>
                        <span></span>
                        <span></span>
                        <span></span>
                      </LoadingDots>
                    </LoadingMessage>
                  );
                }

                // AI 메시지(투둥이)일 때만 프로필 이미지 추가
                if (!msg.isUser) {
                  return (
                    <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <img
                        src={todoongiImg}
                        alt="투둥이 프로필"
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginRight: 12,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          background: '#fff',
                          border: '2px solid #FFD600',
                          flexShrink: 0
                        }}
                      />
                      <MessageBubble $isUser={false}>{msg.text}</MessageBubble>
                    </div>
                  );
                }

                // 유저 메시지는 기존대로
                return (
                  <MessageBubble key={msg.id} $isUser={msg.isUser}>
                    {msg.text}
                  </MessageBubble>
                );
              })}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputContainer>
              <MessageInput
                type="text"
                placeholder="메시지를 입력하세요..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                </svg>
              </SendButton>
            </InputContainer>
          </ChatContainer>
        </MainCard>
      </PageContainer>

      {/* Celebration Stars Animation */}
      {showFireworks && (
        <FireworksOverlay>
          {generateCelebrationStars().map(star => (
            <CelebrationStar
              key={star.id}
              color={star.color}
              size={star.size}
              delay={star.delay}
              style={{
                top: star.top,
                left: star.left
              }}
            />
          ))}
        </FireworksOverlay>
      )}

      {/* Plan Popup */}
      <PlanPopupOverlay show={isPlanPopupVisible} onClick={() => setIsPlanPopupVisible(false)}>
        <PlanPopup onClick={(e) => e.stopPropagation()}>
          <PopupTitle>이런 계획 어때?</PopupTitle>

          {planData && (
            <>
              <MainQuest>
                <MainQuestTitle>{planData.mainQuest}</MainQuestTitle>
              </MainQuest>

              <SubQuestsList>
                {planData.subQuests.map((quest, index) => (
                  <SubQuestItem key={index}>
                    <QuestDate>{quest.date}</QuestDate>
                    <QuestTask>{quest.task}</QuestTask>
                  </SubQuestItem>
                ))}
              </SubQuestsList>

              <PopupButtons>
                <AcceptButton onClick={handleAcceptPlan}>
                  ✅ 이 계획으로 진행할래
                </AcceptButton>
                <RejectButton onClick={handleRejectPlan}>
                  ❌ 다시 짤래
                </RejectButton>
              </PopupButtons>
            </>
          )}
        </PlanPopup>
      </PlanPopupOverlay>
    </>
  );
};

export default ChatPage;