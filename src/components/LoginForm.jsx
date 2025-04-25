import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';

// ================================
// 🔸 Animations
// ================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: -100px; }
  40%, 100% { background-position: 140px; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
`;

// ================================
// 🔸 Styled Components
// ================================

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  width: 390px;
  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.2s;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
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

const FormTitle = styled.h2`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2.5rem;
  color: #3A2618;
  margin-bottom: 1.5rem;
  text-align: center;
  animation: ${float} 4s ease-in-out infinite;
`;

const SmallLogo = styled.div`
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 2rem;
  font-weight: 900;
  color: #3A2618;
  margin-bottom: 1rem;
  text-align: center;
  animation: ${float} 4s ease-in-out infinite;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  width: 100%;
  position: relative;
  
  &:nth-child(2) {
    animation: ${fadeIn} 0.8s ease-out forwards;
    animation-delay: 0.4s;
    opacity: 0;
  }
  
  &:nth-child(3) {
    animation: ${fadeIn} 0.8s ease-out forwards;
    animation-delay: 0.6s;
    opacity: 0;
  }
  
  &:nth-child(4) {
    animation: ${fadeIn} 0.8s ease-out forwards;
    animation-delay: 0.7s;
    opacity: 0;
  }
  
  &:nth-child(5) {
    animation: ${fadeIn} 0.8s ease-out forwards;
    animation-delay: 0.8s;
    opacity: 0;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: #3A2618;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid transparent;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  
  &:focus {
    border-color: ${props => props.color || '#4F87FF'};
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
  
  ${props => props.shine && css`
    background: linear-gradient(to right, 
      rgba(255,255,255,0.8) 0%,
      rgba(255,255,255,1) 40%,
      rgba(255,255,255,1) 60%,
      rgba(255,255,255,0.8) 100%
    );
    background-size: 200px 100%;
    background-repeat: no-repeat;
    background-position: -100px;
    animation: ${shine} 2s infinite;
  `}
  
  ${props => props.error && css`
    border-color: #FF5252;
    animation: ${shake} 0.5s;
  `}
`;

const InputLabel = styled.label`
  display: block;
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
  font-size: 0.9rem;
  color: #3A2618;
  margin-bottom: 0.4rem;
  margin-left: 0.5rem;
`;

const CheckButton = styled.button`
  padding: 0.8rem 1rem;
  flex-shrink: 0;
  font-family: 'Nunito', sans-serif;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: ${props => props.bgColor || '#4F87FF'};
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  animation: ${fadeInRight} 0.5s ease-out forwards;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ErrorMessage = styled.div`
  color: #FF5252;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  margin-left: 0.8rem;
  font-family: 'Nunito', sans-serif;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  
  &:before {
    content: "⚠️";
    margin-right: 0.4rem;
    font-size: 0.9rem;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  width: 100%;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.8s;
  opacity: 0;
`;

const SocialButton = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: none;
  background: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 24px;
    height: 24px;
    fill: white;
  }
`;

const StyledOr = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1.2rem 0;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.7s;
  opacity: 0;
  
  &::before, &::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.1);
    margin: 0 10px;
  }
  
  span {
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem;
    color: #777;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  font-family: 'Nostalgia', 'Pacifico', cursive;
  font-size: 1.2rem;
  color: white;
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 135, 255, 0.3);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.9s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.15);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: rotate(45deg);
    transition: all 0.3s ease;
    opacity: 0;
  }
`;

const ToggleFormText = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: #3A2618;
  margin-top: 1.5rem;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 1s;
  opacity: 0;
  
  span {
    color: #4F87FF;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      color: #B344E2;
      text-decoration: underline;
    }
  }
`;

// ================================
// 🔸 Main Component
// ================================

const LoginForm = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [fieldShine, setFieldShine] = useState({});
  
  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  
  // Validation states
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [nicknameAvailable, setNicknameAvailable] = useState(true);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSignup) {
      // Validate passwords match
      if (password !== confirmPassword) {
        setPasswordMatch(false);
        return;
      }
      
      console.log('Signup attempted with:', { email, password, nickname });
      // For now, successful signup automatically logs the user in as well
      if (onLoginSuccess) onLoginSuccess();
    } else {
      console.log('Login attempted with:', { username, password });
      // For the placeholder behavior, any input logs the user in
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  // Add shining effect to input fields when focused
  const activateShine = (field) => {
    setFieldShine(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setFieldShine(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };
  
  // Check if email is available
  const checkEmailAvailability = () => {
    // Simulate API call
    setFieldShine(prev => ({ ...prev, email: true }));
    setTimeout(() => {
      setFieldShine(prev => ({ ...prev, email: false }));
      setEmailAvailable(email !== 'test@example.com'); // For demo purposes
    }, 1000);
  };
  
  // Check if nickname is available
  const checkNicknameAvailability = () => {
    // Simulate API call
    setFieldShine(prev => ({ ...prev, nickname: true }));
    setTimeout(() => {
      setFieldShine(prev => ({ ...prev, nickname: false }));
      setNicknameAvailable(nickname !== 'admin'); // For demo purposes
    }, 1000);
  };
  
  // Validate password confirmation
  const validatePasswordMatch = () => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  };
  
  // Toggle between login and signup forms
  const toggleForm = () => {
    setIsSignup(!isSignup);
    // Reset fields and validation states
    setUsername('');
    setPassword('');
    setEmail('');
    setConfirmPassword('');
    setNickname('');
    setPasswordMatch(true);
    setEmailAvailable(true);
    setNicknameAvailable(true);
  };

  return (
    <FormContainer isSignup={isSignup}>
      {isSignup ? (
        <>
          <SmallLogo>Todooungi</SmallLogo>
          <FormTitle>Join Us!</FormTitle>
          
          <form onSubmit={handleSubmit} style={{width: '100%'}}>
            <FormGroup>
              <InputLabel htmlFor="email">Email</InputLabel>
              <InputRow>
                <InputField 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={email}
                  color="#FF5252"
                  shine={fieldShine.email}
                  error={!emailAvailable}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailAvailable(true);
                  }}
                  onFocus={() => activateShine('email')}
                />
                <CheckButton 
                  type="button"
                  bgColor="#FF5252"
                  onClick={checkEmailAvailability}
                >
                  Check
                </CheckButton>
              </InputRow>
              {!emailAvailable && (
                <ErrorMessage>이미 존재하는 이메일 입니다.</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <InputLabel htmlFor="signup-password">Password</InputLabel>
              <InputField 
                type="password" 
                id="signup-password" 
                placeholder="Create a password" 
                value={password}
                color="#4F87FF"
                shine={fieldShine.signupPassword}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (confirmPassword) validatePasswordMatch();
                }}
                onFocus={() => activateShine('signupPassword')}
              />
            </FormGroup>
            
            <FormGroup>
              <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
              <InputField 
                type="password" 
                id="confirm-password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                color="#4AD66D"
                shine={fieldShine.confirmPassword}
                error={!passwordMatch}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value) {
                    setPasswordMatch(password === e.target.value);
                  }
                }}
                onFocus={() => activateShine('confirmPassword')}
                onBlur={validatePasswordMatch}
              />
              {!passwordMatch && (
                <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <InputLabel htmlFor="nickname">Nickname</InputLabel>
              <InputRow>
                <InputField 
                  type="text" 
                  id="nickname" 
                  placeholder="Choose a nickname" 
                  value={nickname}
                  color="#FFD600"
                  shine={fieldShine.nickname}
                  error={!nicknameAvailable}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameAvailable(true);
                  }}
                  onFocus={() => activateShine('nickname')}
                />
                <CheckButton 
                  type="button"
                  bgColor="#FFD600"
                  onClick={checkNicknameAvailability}
                >
                  Check
                </CheckButton>
              </InputRow>
              {!nicknameAvailable && (
                <ErrorMessage>이미 존재하는 닉네임입니다.</ErrorMessage>
              )}
            </FormGroup>
            
            <SubmitButton 
              type="submit"
              disabled={!emailAvailable || !passwordMatch || !nicknameAvailable}
            >
              Sign Up
            </SubmitButton>
          </form>
          
          <StyledOr>
            <span>OR</span>
          </StyledOr>
          
          <SocialButtonsContainer>
            <SocialButton bgColor="#FEE500" title="Signup with Kakao">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.03 3 3 6.14 3 9.97c0 2.54 1.72 4.77 4.32 6.02.25.1.48.29.5.54l.1 2.13c.03.33.33.57.65.43l2.46-1.06c.25-.11.53-.13.78-.07A12.5 12.5 0 0 0 12 18c4.97 0 9-3.14 9-7s-4.03-8-9-8z" fill="#3A2618"/>
              </svg>
            </SocialButton>
            
            <SocialButton bgColor="#ffffff" title="Signup with Google">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
              </svg>
            </SocialButton>
          </SocialButtonsContainer>
          
          <ToggleFormText>
            계정이 있으신가요? <span onClick={toggleForm}>LogIn</span>
          </ToggleFormText>
        </>
      ) : (
        <>
          <FormTitle>Welcome Back!</FormTitle>
          
          <form onSubmit={handleSubmit} style={{width: '100%'}}>
            <FormGroup>
              <InputLabel htmlFor="username">Username</InputLabel>
              <InputField 
                type="text" 
                id="username" 
                placeholder="Enter your username" 
                value={username}
                color="#FF5252"
                shine={fieldShine.username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => activateShine('username')}
              />
            </FormGroup>
            
            <FormGroup>
              <InputLabel htmlFor="password">Password</InputLabel>
              <InputField 
                type="password" 
                id="password" 
                placeholder="Enter your password" 
                value={password}
                color="#4AD66D"
                shine={fieldShine.password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => activateShine('password')}
              />
            </FormGroup>
            
            <SubmitButton type="submit">Log In</SubmitButton>
          </form>
          
          <StyledOr>
            <span>OR</span>
          </StyledOr>
          
          <SocialButtonsContainer>
            <SocialButton bgColor="#FEE500" title="Login with Kakao">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.03 3 3 6.14 3 9.97c0 2.54 1.72 4.77 4.32 6.02.25.1.48.29.5.54l.1 2.13c.03.33.33.57.65.43l2.46-1.06c.25-.11.53-.13.78-.07A12.5 12.5 0 0 0 12 18c4.97 0 9-3.14 9-7s-4.03-8-9-8z" fill="#3A2618"/>
              </svg>
            </SocialButton>
            
            <SocialButton bgColor="#ffffff" title="Login with Google">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#4285F4"/>
              </svg>
            </SocialButton>
          </SocialButtonsContainer>
          
          <ToggleFormText>
            처음이신가요? <span onClick={toggleForm}>회원가입</span>
          </ToggleFormText>
        </>
      )}
    </FormContainer>
  );
};

LoginForm.propTypes = {
  onLoginSuccess: PropTypes.func
};

export default LoginForm;