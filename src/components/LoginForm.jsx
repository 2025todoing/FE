import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import { login } from '../api/auth';
import { signup } from '../api/auth';
import axios from 'axios';

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

const errorBorderPulse = keyframes`
  0%, 100% { border-color: #FF5252; box-shadow: 0 0 0 1px rgba(255, 82, 82, 0.2); }
  50% { border-color: #FF0000; box-shadow: 0 0 0 4px rgba(255, 82, 82, 0.3); }
`;

// ================================
// 🔸 Styled Components
// ================================

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  /* padding 수정, 모두 화면 크기에 맞게 부드럽게 반응으로*/
  padding: clamp(12px, 3vw, 24px);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(10px);
  border-radius: clamp(16px, 2vw, 24px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);

  /* width:390px ->화면에 맞춰 자동: 최소 320 ~ 최대 640 */
  width: clamp(300px, 86vw, 520px);

  opacity: 0;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.2s;
  position: relative;
  overflow: hidden;

  @media(max-height: 680px ) {
    padding: 12px;
  }
  
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
  font-size: clamp(20px, 2.8vw, 28px);
  color: #3A2618;
  margin-bottom: clamp(8px, 1.8vw, 16px);
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

const InputField = styled.input.withConfig({ shouldForwardProp: (prop) => !['shine', 'error', 'color'].includes(prop), })`
  width: 100%;
  /* iOS 줌 방지 최소 16px 확보하면서, 화면에 맞춰 유동 */
  font-size: clamp(16px, 1.8vw, 18px);
  line-height: 1.5;
  padding: clamp(16px, 3.8vw, 18px) clamp(18px, 4.4vw, 22px);
  min-height: 56px;

  font-family: 'Nunito', sans-serif;
  font-size: clamp(16px, 1.9vw, 18px);
  color: #3A2618;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid transparent;
  border-radius: 9999px;
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
    animation: ${shake} 0.5s, ${errorBorderPulse} 2s infinite;
    background-color: rgba(255, 82, 82, 0.05);
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
  padding: clamp(10px, 2vw, 12px) clamp(10px, 2.4vw, 12px);
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
  gap: clamp(10px, 2vw, 16px);
  margin-top: clamp(8px, 2vw, 12px);
  width: 100%;
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: 0.8s;
  opacity: 0;
`;

const SocialButton = styled.button`
  width: clamp(40px, 4.6vw, 52px);
  height: clamp(40px, 4.6vw, 52px);
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
  margin: clamp(8px, 2vw, 12px) 0;
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
  padding: clamp(14px, 3vw, 16px);
  margin-top: clamp(6px, 1.4vw, 8px);
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

/* 모션 민감한 기기 배려: 애니메이션 최소화 */
const ReducedMotionGlobal = createGlobalStyle`
  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

// ================================
// 🔸 Main Component
// ================================

const LoginForm = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [fieldShine, setFieldShine] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const mode = new URLSearchParams(location.search).get('mode');
    setIsSignup(mode === 'signup');
    }, [location.search]);
  
  const setMode = (mode) => {
    setIsSignup(mode === 'signup');
    navigate(`/auth?mode=${mode}`, { replace: true });
    };
  
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
  
  // Login error states
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚨 handleSubmit 실행됨");
    
    if (isSignup) {
      if (password !== confirmPassword) {
        setPasswordMatch(false);
        return;
      }

      try {
        console.log("🚨 handleSubmit 실행됨");
        const response = await signup(email, password, nickname);
        console.log('Signup response:', response);

        if (response.data.isSuccess && response.data.code === "COMMON200") {
          alert('회원가입이 완료되었습니다! 로그인 해주세요.');

          // 모든 상태 초기화
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setNickname('');
          setFieldShine({});
          setPasswordMatch(true);
          setEmailAvailable(true);
          setNicknameAvailable(true);
          setLoginError(false);
          setErrorMessage('');

          setIsSignup(false); // 로그인 화면으로 전환
        } else {
          setLoginError(true);
          setErrorMessage(response.data.message || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        console.error('Signup error:', error);
        setLoginError(true);
        setErrorMessage('회원가입 중 오류가 발생했습니다.');
      }

      return;
    }

     else {
      console.log('API_BASE:', import.meta.env.VITE_BACKEND);
      console.log('username type:', typeof username, 'value:', username);
      console.log('password type:', typeof password, 'value:', password);
      
      try {
        setLoginError(false);
        setErrorMessage('');
        
        const response = await login(username, password);
        console.log('Login response:', response);
        
        // Check response format based on the API contract
        if (response.data.isSuccess && response.data.code === "COMMON200") {
          // Store tokens in localStorage
          localStorage.setItem('accessToken', response.data.result.accessToken);
          localStorage.setItem('refreshToken', response.data.result.refreshToken);
          
          // Call the success callback
          if (onLoginSuccess) onLoginSuccess();
        } else if (response.data.isSuccess && response.data.code === "404") {
          // Handle the case where member is not found
          setLoginError(true);
          setErrorMessage(response.data.message || '멤버를 찾을 수 없습니다.');
        } else {
          // Handle other error cases
          setLoginError(true);
          setErrorMessage('로그인에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(true);
        setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
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
    <FormContainer>
      {isSignup ? (
        <>
          <SmallLogo>Todooungi</SmallLogo>
          <FormTitle>Join Us!</FormTitle>
          
          <form onSubmit={handleSubmit} style={{width: '100%'}}>
            <FormGroup>
              <InputLabel htmlFor="username">이메일 </InputLabel>
              <InputRow>
                <InputField 
                  type="email" 
                  id="email" 
                  placeholder="이메일을 입력해 주세요." 
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
            계정이 있으신가요? <span onClick={() => setMode('login')}>LogIn</span>
          </ToggleFormText>
        </>
      ) : (
        <>
          <FormTitle>Welcome Back!</FormTitle>
          
          <form onSubmit={handleSubmit} style={{width: '100%'}}>
            <FormGroup>
              <InputLabel htmlFor="username">Email</InputLabel>
              <InputField 
                type="text" 
                id="username" 
                placeholder="이메일을 입력해 주세요." 
                value={username}
                color="#FF5252"
                shine={fieldShine.username}
                error={loginError}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (loginError) {
                    setLoginError(false);
                    setErrorMessage('');
                  }
                }}
                onFocus={() => activateShine('username')}
              />
            </FormGroup>
            
            <FormGroup>
              <InputLabel htmlFor="password">비밀번호</InputLabel>
              <InputField 
                type="password" 
                id="password" 
                placeholder="비밀번호를 입력해 주세요." 
                value={password}
                color="#4AD66D"
                shine={fieldShine.password}
                error={loginError}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) {
                    setLoginError(false);
                    setErrorMessage('');
                  }
                }}
                onFocus={() => activateShine('password')}
              />
              {loginError && (
                <ErrorMessage>{errorMessage}</ErrorMessage>
              )}
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