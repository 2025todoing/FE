import styled from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';
import LoginForm from './LoginForm';

const Full = styled.div`
  min-height: 100svh;          /* 모바일에서도 꽉 차게 */
  display: grid;
  place-items: center;         /* 정중앙 */
  padding: clamp(16px, 4vw, 32px);
  position: relative;
  overflow: hidden;            /* 배경이 새어나오지 않게 */
  z-index: 0;
`;

export default function AuthPage({ onLoginSuccess }) {
    return (
        <>
            <BackgroundAnimation />
            <Full>
                <LoginForm onLoginSuccess={onLoginSuccess} />
            </Full>
        </>
    );
}