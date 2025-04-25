import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';
import LoginForm from './LoginForm';
import PropTypes from 'prop-types';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-50px); }
`;

const scaleUp = keyframes`
  from { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
  to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const starRotate = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
`;

const starOpacity = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const starCircle = keyframes`
  0% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-15px) translateX(10px); }
  50% { transform: translateY(0) translateX(20px); }
  75% { transform: translateY(15px) translateX(10px); }
  100% { transform: translateY(0) translateX(0); }
`;

const floatingAnimation1 = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(-30px, -30px); }
  50% { transform: translate(-20px, 20px); }
  75% { transform: translate(30px, 10px); }
  100% { transform: translate(0, 0); }
`;

const floatingAnimation2 = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(30px, -20px); }
  50% { transform: translate(40px, 30px); }
  75% { transform: translate(-20px, 20px); }
  100% { transform: translate(0, 0); }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  padding: 2rem;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  
  ${props => props.showLogin && css`
    animation: ${fadeOut} 0.5s forwards;
    position: absolute;
    pointer-events: none;
  `}
  
  ${props => !props.showLogin && props.attempted && css`
    animation: ${fadeIn} 0.5s forwards;
  `}
`;

const LoginWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;   
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => props.show && css`
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    animation: ${scaleUp} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  `}
`;

const LogoHeader = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  display: ${props => props.show ? 'block' : 'none'};
  animation: ${fadeIn} 0.5s ease-in-out;
  cursor: pointer;
  z-index: 150;
`;

const SmallLogo = styled.div`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2.2rem;
  font-weight: 900;
  color: #3A2618;
  opacity: 0.8;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const Logo = styled.div`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 9.5rem;
  font-weight: 900;
  text-align: center;
  letter-spacing: -0.05em;
  animation: ${fadeIn} 1.5s ease-in-out;
  margin-bottom: 2rem;
  line-height: 0.9;
  
  &:hover span {
    animation: ${bounce} 0.5s ease-in-out;
  }
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const LogoLetter = styled.span`
  display: inline-block;
  color: ${props => props.color};
  transition: transform 0.3s ease;
  text-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1);
  animation-fill-mode: both;
  animation-delay: ${props => props.delay}s;
  
  &:hover {
    transform: scale(1.2) rotate(${props => props.rotate}deg);
  }

  ${props => props.isHovering && css`
    animation: ${bounce} ${props => props.duration}s infinite;
    animation-delay: ${props => props.delay}s;
  `}
`;

const CTAWrapper = styled.div`
  position: relative;
  margin-top: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: none; /* Make wrapper pass through clicks to children */
`;

const CTAText = styled.button`
  position: relative;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.8rem;
  font-weight: 500;
  color: #3A2618;
  text-align: center;
  padding: 1rem 2rem;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
  animation: ${fadeIn} 1.5s ease-in-out 0.5s forwards;
  opacity: 0;
  cursor: pointer;
  border: none;
  outline: none;
  z-index: 10;
  pointer-events: auto; /* Ensure clickable */
  min-width: 380px; /* Ensure minimum width */
  
  &:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin-top: 6vh;
    min-width: 320px; /* Adjust for smaller screens */
  }
`;

const Star = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0);
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 4;
  pointer-events: none; /* Ensure stars don't block clicks */
  
  &:before {
    content: "✦";
    position: absolute;
    color: gold;
    font-size: 24px;
    animation: ${starRotate} 1.5s linear infinite,
               ${starOpacity} 1.5s ease-in-out infinite,
               ${starCircle} 4s ease-in-out infinite;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  }

  &:nth-child(2):before {
    animation-delay: 0.2s;
    font-size: 18px;
  }

  &:nth-child(3):before {
    animation-delay: 0.4s;
    font-size: 20px;
  }
`;

const StarLeft = styled(Star)`
  left: -30px;
  top: 50%;
  transform: translateY(-50%);
`;

const StarRight = styled(Star)`
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
`;

const StarTop = styled(Star)`
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
`;

const FloatingStar = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 4;
  pointer-events: none;
  
  &:before {
    content: "✦";
    position: absolute;
    color: gold;
    font-size: ${props => props.size || '16px'};
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
  }
`;

const StarFloat1 = styled(FloatingStar)`
  left: -50px;
  top: -30px;
  animation: ${floatingAnimation1} 6s ease-in-out infinite, 
             ${starRotate} 2s linear infinite,
             ${starOpacity} 2s ease-in-out infinite;
`;

const StarFloat2 = styled(FloatingStar)`
  right: -40px;
  bottom: -20px;
  animation: ${floatingAnimation2} 8s ease-in-out infinite,
             ${starRotate} 3s linear infinite reverse,
             ${starOpacity} 3s ease-in-out infinite;
`;

const StarFloat3 = styled(FloatingStar)`
  left: -60px;
  bottom: -15px;
  animation: ${floatingAnimation2} 7s ease-in-out infinite reverse,
             ${starRotate} 2.5s linear infinite,
             ${starOpacity} 2.5s ease-in-out infinite;
`;

const StarFloat4 = styled(FloatingStar)`
  right: -60px;
  top: -25px;
  animation: ${floatingAnimation1} 9s ease-in-out infinite reverse,
             ${starRotate} 3.5s linear infinite reverse,
             ${starOpacity} 3.5s ease-in-out infinite;
`;

// Modal overlay for capturing clicks outside the login form
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  opacity: 0;
  visibility: hidden;
  z-index: 90;
  transition: all 0.3s ease;
  
  ${props => props.show && css`
    opacity: 1;
    visibility: visible;
  `}
`;

const LandingPage = (props) => {
  // Colors for each letter of "Todooungi"
  const logoColors = [
    "#FF5252", // Red - T
    "#4F87FF", // Blue - o
    "#FFD600", // Yellow - d
    "#4AD66D", // Green - o
    "#FF8C1A", // Orange - o
    "#B344E2", // Purple - u
    "#FF5252", // Red - n
    "#4F87FF", // Blue - g
    "#FFD600"  // Yellow - i
  ];
  
  const letters = "Todooungi".split('');
  const [isHovering, setIsHovering] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [attempted, setAttempted] = useState(false);
  
  const handleLoginClick = () => {
    setShowLogin(true);
    setAttempted(true);
  };
  
  const handleBackToHome = () => {
    setShowLogin(false);
  };

  return (
    <>
      <BackgroundAnimation />
      <Container>
        {showLogin && (
          <LogoHeader show={showLogin} onClick={handleBackToHome}>
            <SmallLogo>Todooungi</SmallLogo>
          </LogoHeader>
        )}
        
        <ContentWrapper showLogin={showLogin} attempted={attempted}>
          <Logo>
            {letters.map((letter, index) => (
              <LogoLetter 
                key={index}
                color={logoColors[index]}
                rotate={Math.random() * 10 - 5}
                delay={0.1 * index}
                duration={Math.random() * 0.5 + 0.5}
                isHovering={isHovering}
              >
                {letter}
              </LogoLetter>
            ))}
          </Logo>
          
          <CTAWrapper>
            <StarLeft show={isHovering} />
            <StarTop show={isHovering} />
            <StarRight show={isHovering} />
            
            {isHovering && (
              <>
                <StarFloat1 show={true} size="16px" />
                <StarFloat2 show={true} size="18px" />
                <StarFloat3 show={true} size="14px" />
                <StarFloat4 show={true} size="20px" />
              </>
            )}
            
            <CTAText 
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={handleLoginClick}
            >
              Log in to start your journey with Todooungi
            </CTAText>
          </CTAWrapper>
        </ContentWrapper>
        
        <ModalOverlay show={showLogin} onClick={handleBackToHome} />
        
        <LoginWrapper show={showLogin}>
          <LoginForm onLoginSuccess={props.onLoginSuccess} />
        </LoginWrapper>
      </Container>
    </>
  );
};

LandingPage.propTypes = {
  onLoginSuccess: PropTypes.func
};

export default LandingPage;