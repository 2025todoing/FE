import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';

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
    margin-right: 0.5rem;
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
  border-radius: ${props => props.isUser ? '18px 18px 0 18px' : '18px 18px 18px 0'};
  background: ${props => props.isUser ? 'linear-gradient(45deg, #4F87FF, #B344E2)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.isUser ? 'white' : '#333'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    ${props => props.isUser ? 'right' : 'left'}: 0;
    width: 12px;
    height: 12px;
    background: ${props => props.isUser ? 'linear-gradient(45deg, #4F87FF, #B344E2)' : 'rgba(255, 255, 255, 0.8)'};
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

// ChatPage Component
const ChatPage = ({ onBack, todoDetails }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      isUser: false, 
      text: `안녕하세요! 저는 투둥이에요. "${todoDetails?.category || '운동'}" 할 일을 계획하고 정리하는 것을 도와드릴게요. 어떤 것을 도와드릴까요?`
    }
  ]);
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      isUser: true,
      text: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate Todooungi's response after a short delay
    setTimeout(() => {
      const todooungiResponse = {
        id: messages.length + 2,
        isUser: false,
        text: generateTodooungiResponse(message)
      };
      
      setMessages(prev => [...prev, todooungiResponse]);
    }, 1000);
  };
  
  // Generate a simple response from Todooungi (placeholder for actual AI)
  const generateTodooungiResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return "Hello! How can I help you with your todo today?";
    } else if (lowerCaseMessage.includes('help')) {
      return "I can help you plan and organize your tasks. Just tell me what you'd like to accomplish!";
    } else if (lowerCaseMessage.includes('thank')) {
      return "You're welcome! Is there anything else you'd like help with?";
    } else if (lowerCaseMessage.includes('time') || lowerCaseMessage.includes('when')) {
      return "When would you like to schedule this task? Morning, afternoon, or evening?";
    } else if (lowerCaseMessage.includes('how')) {
      return "I can guide you through this step by step. What specific aspect would you like help with?";
    } else {
      return "That's a great idea! Would you like me to add this to your todo list or would you like some suggestions to break this down into smaller tasks?";
    }
  };
  
  // Handle Enter key press in input
  const handleKeyPress = (e) => {
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
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              이전으로
            </BackButton>
            <Logo>Todooungi</Logo>
          </Header>
          
          <ChatContainer>
            <MessagesContainer>
              <WelcomeMessage>
                <WelcomeTitle>투둥이와 대화하기</WelcomeTitle>
                <WelcomeText>
                  할 일을 계획하고 달성하는 데 도움을 드릴게요. 함께 효과적으로 할 일을 관리해보아요!
                </WelcomeText>
              </WelcomeMessage>
              
              {messages.map(msg => (
                <MessageBubble key={msg.id} isUser={msg.isUser}>
                  {msg.text}
                </MessageBubble>
              ))}
              <div ref={messagesEndRef} />
            </MessagesContainer>
            
            <InputContainer>
              <MessageInput 
                type="text" 
                placeholder="메시지를 입력하세요..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton 
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
              </SendButton>
            </InputContainer>
          </ChatContainer>
        </MainCard>
      </PageContainer>
    </>
  );
};

export default ChatPage;