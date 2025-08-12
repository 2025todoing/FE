// src/components/LandingPage.jsx
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import BackgroundAnimation from './BackgroundAnimation';
import LoginForm from './LoginForm';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const ko = css`
  font-family: var(--font-sans);
  word-break: keep-all;
  letter-spacing: 0;   /* 한글은 자간 0이 안정적 */
`;

/* ---------- Animations ---------- */
const fadeInUp = keyframes`
  from { opacity:0; transform: translateY(12px); }
  to   { opacity:1; transform: translateY(0); }
`;
const fadeIn = keyframes`
  from { opacity:0 }
  to   { opacity:1 }
`;
const bounce = keyframes`
  0%,100%{ transform:translateY(0) }
  50%{ transform:translateY(-6px) }
`;

/* ---------- Layout ---------- */
const Page = styled.div`
  position: relative;
  width: 100%;
  min-height: 100dvh;           /* 스크롤 허용 */
  overflow-x: hidden;
  scroll-behavior: smooth;      /* 앵커 스크롤 부드럽게 */
  padding-bottom: 64px;
`;

const Section = styled.section`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(32px, 6vw, 96px) clamp(16px, 5vw, 32px);
  animation: ${fadeIn} .6s ease both;
`;

/* ---------- Hero ---------- */
const Hero = styled(Section)`
/* 첫 랜딩페이지 채우기 */
  min-height: 100svh; 
  display: grid;
  place-items: center;
  text-align: center;

  /*상하 패딩 추가*/
  padding-top: calc(env(safe-area-inset-top) + clamp(16px, 4vw, 28px));
  padding-bottom: calc(env(safe-area-inset-bottom) + clamp(16px, 4vw, 28px));
`;

const Logo = styled.h1`
  font-family: 'Nostalgia','Pacifico',cursive;
  /* 너무 커지는 것 방지: 모바일~데스크탑 자연 스케일 */
  font-size: clamp(44px, 14vw, 120px);
  line-height: .9;
  letter-spacing: -0.02em;
  margin: 0 0 clamp(8px, 2vw, 12px);
  animation: ${fadeInUp} .7s ease both;

  /* 개별 글자 살짝 튕김 */
  span { display:inline-block; transition: transform .25s; }
  span:hover { transform: scale(1.14) rotate(-1.5deg); }
`;

const Tagline = styled.p`
  font-size: clamp(14px, 2.6vw, 18px);
  color: #3A2618;
  opacity: .85;
  margin: 0 auto clamp(16px, 3vw, 24px);
  max-width: 720px;
  animation: ${fadeInUp} .8s ease .1s both;
`;

const HeroCtas = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  animation: ${fadeInUp} .9s ease .2s both;
`;

const CtaButton = styled.a`
  display: inline-block;
  padding: clamp(12px, 3.2vw, 16px) clamp(16px, 4vw, 22px);
  border-radius: 9999px;
  font-weight: 800;
  font-size: clamp(14px, 2.4vw, 16px);
  text-decoration: none;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
  box-shadow: 0 8px 20px rgba(79,135,255,.25);
  background: linear-gradient(45deg,#4F87FF,#B344E2);
  color: #fff;

  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

/* ---------- Features ---------- */
const Features = styled(Section)`
  background: rgba(255,255,255,.55);
  backdrop-filter: blur(6px);
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(0,0,0,.06);
`;

const FeaturesTitle = styled.h2`
  font-family: var(--font-sans);
  font-size: clamp(24px, 4.2vw, 40px);
  text-align: center;
  margin-bottom: clamp(16px, 3vw, 24px);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(12px, 2.8vw, 24px);

  /* 태블릿(>=720px): 2열 */
  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 1120px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  @media (min-width: 1440px) {
   grid-template-columns: repeat(4,1fr); 
  }
`;

const Card = styled.div`
  padding: clamp(14px, 3vw, 20px);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0,0,0,.06);
  display: grid;
  gap: 8px;
  min-width: 0;
  transition: transform .18s ease, box-shadow .18s ease;

  &:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,.09); }
`;

const CardIcon = styled.div`
  font-size: clamp(20px, 3vw, 28px);
  line-height: 1;
`;
const CardTitle = styled.h3`
  font-weight: 800;
  font-size: clamp(16px, 2.6vw, 18px);
`;
const CardDesc = styled.p`
  font-size: clamp(13px, 2.2vw, 15px);
  color: #555;
`;

/* ---------- Steps ---------- */
const Steps = styled(Section)``;

const StepsTitle = styled.h2`
  font-family: var(--font-sans);
  font-size: clamp(22px, 4vw, 36px);
  text-align: center;
  margin-bottom: clamp(12px, 2.6vw, 20px);
`;

const StepList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: clamp(12px, 3vw, 20px);

  /* 모바일: 세로 1열 */
  grid-template-columns: 1fr;

  /* 태블릿 이상: 2열 */
  @media (min-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* 와이드 데스크탑 이상: 4열 */
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StepItem = styled.li`
  display: grid;
  gap: 12px;

  /* 모바일: 뱃지 위, 텍스트 아래 */
  grid-template-columns: 1fr;
  min-width: 0; /* 텍스트 세로 깨짐 방지 */

  padding: clamp(14px, 3vw, 18px);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.75));
  box-shadow: 0 10px 24px rgba(0,0,0,.06);
  backdrop-filter: blur(6px);
  transition: transform .18s ease, box-shadow .18s ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,0,0,.09); }

  @media (min-width: 720px) {
    /* 태블릿+: 뱃지-텍스트 가로배치 */
    grid-template-columns: auto 1fr;
    align-items: start;
  }
`;

const StepBadge = styled.div`
  width: clamp(40px, 6vw, 48px);
  height: clamp(40px, 6vw, 48px);
  border-radius: 9999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;

  /* 그라디언트 동그라미로 수정 */
  background: linear-gradient(135deg, ${p => p.$from}, ${p => p.$to});
  box-shadow: 0 8px 18px ${p => p.$shadow || 'rgba(79,135,255,.35)'};

  position: relative;
  isolation: isolate;
  &:after{
    content:'';
    position: absolute; inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 2px rgba(255,255,255,.35);
    pointer-events: none;
  }
`;

const StepTextWrap = styled.div`
  display: grid;
  gap: 4px;
`;

const StepTitle = styled.h3`
  margin: 6px 0 8px;
  font-size: clamp(16px, 2.6vw, 18px);
  font-weight: 800;
`;
const StepText = styled.p`
  color: #555;
  font-size: clamp(13px, 2.2vw, 15px);
`;

/* ---------- CTA + Login ---------- */
const FinalCta = styled(Section)`
  display: grid;
  gap: clamp(16px, 3vw, 24px);
  justify-items: center;
  text-align: center;
`;

const FinalTitle = styled.h2`
  font-family: var(--font-sans);
  font-size: clamp(22px, 4vw, 32px);
  margin: 0;
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const SolidBtn = styled.a`
  ${ko};
  display: inline-block;
  padding: clamp(12px, 3.2vw, 16px) clamp(16px, 4vw, 22px);
  border-radius: 9999px;
  font-weight: 700;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(45deg,#4F87FF,#B344E2);
  box-shadow: 0 8px 20px rgba(79,135,255,.25);
  transition: transform .18s ease, box-shadow .18s ease;
  &:hover{ transform: translateY(-2px); box-shadow:0 12px 28px rgba(79,135,255,.32) }
`;

const OutlineBtn = styled.a`
  ${ko};
  display: inline-block;
  padding: clamp(12px, 3.2vw, 16px) clamp(16px, 4vw, 22px);
  border-radius: 9999px;
  font-weight: 700;
  text-decoration: none;
  color: #3A2618;
  background: #fff;
  border: 2px solid rgba(58,38,24,.12);
  transition: transform .18s ease, border-color .18s ease;
  &:hover{ transform: translateY(-2px); border-color: rgba(58,38,24,.25); }
`;



const ScrollHint = styled.div`
  font-size: 13px;
  opacity: .7;
  margin-top: 4px;
  animation: ${bounce} 1.6s ease-in-out infinite;
`;

/* ---------- Component ---------- */
const LandingPage = ({ onLoginSuccess }) => {
  const logoColors = ["#FF5252", "#4F87FF", "#FFD600", "#4AD66D", "#FF8C1A", "#B344E2", "#FF5252", "#4F87FF", "#FFD600"];
  const letters = "Todooungi".split('');

  return (
    <>
      <BackgroundAnimation />

      <Page>
        {/* HERO */}
        <Hero>
          <div>
            <Logo aria-label="Todooungi">
              {letters.map((ch, i) => (
                <span key={i} style={{ color: logoColors[i] }}>{ch}</span>
              ))}
            </Logo>

            <Tagline>
              당신의 목표 달성, 이제 투둥이와 함께<br />
              작은 습관부터 큰 도전까지 - AI가 자동 인증하고,<br />
               친구들과 함께 성장하세요!
            </Tagline>

            <HeroCtas>
              <CtaButton href="#features">무슨 서비스인지 보기</CtaButton>
              <CtaButton href="#get-started">로그인하고 시작하기</CtaButton>
            </HeroCtas>

            <ScrollHint>아래로 스크롤 ↓</ScrollHint>
          </div>
        </Hero>

        {/* FEATURES */}
        <Features id="features">
          <FeaturesTitle>왜 투둥이일까요?</FeaturesTitle>

          <Grid>
            <Card>
              <CardIcon>🧠</CardIcon>
              <CardTitle>똑똑한 정리</CardTitle>
              <CardDesc>우선순위, 마감일, 태그를 한 번에. 복잡한 일정도 보기 좋게 정리돼요.</CardDesc>
            </Card>

            <Card>
              <CardIcon>👥</CardIcon>
              <CardTitle>함께 하는 투두</CardTitle>
              <CardDesc>다양한 챌린지에 친구들과 함께 참여하고, 진행 상황을 실시간으로 확인해요.</CardDesc>
            </Card>

            <Card>
              <CardIcon>📍</CardIcon>
              <CardTitle>AI 인증 시스템</CardTitle>
              <CardDesc>인증을 통해 투둥이가 달성 여부를 확인해 줍니다.</CardDesc>
            </Card>

            <Card>
              <CardIcon>✨</CardIcon>
              <CardTitle>맞춤형 목표 추천</CardTitle>
              <CardDesc>투둥이와 대화를 통해 도전할 만한 투두를 추천해 줍니다.</CardDesc>
            </Card>
          </Grid>
        </Features>

        {/* STEPS */}
        <Steps>
          <StepsTitle>시작은 이렇게 간단해요</StepsTitle>
          <StepList>
            <StepItem>
              <StepBadge $from="#6B8BFF" $to="#8E66FF" $shadow="rgba(139,108,255,.35)">1</StepBadge>
              <StepTextWrap>
                <StepTitle>가입 또는 로그인</StepTitle>
                <StepText>이메일로 간단히 시작하거나, 소셜 로그인을 사용할 수 있어요.</StepText>
              </StepTextWrap>
            </StepItem>

            <StepItem>
              <StepBadge $from="#FF8A8A" $to="#FF6B6B" $shadow="rgba(255,107,107,.35)">2</StepBadge>
              <StepTextWrap>
                <StepTitle>할 일 추가</StepTitle>
                <StepText>직접 태그/마감일/메모를 붙여 한 번에 정리하거나, 투둥이가 추천하는 투두를 선택할 수 있어요.</StepText>
              </StepTextWrap>
            </StepItem>

            <StepItem>
              <StepBadge $from="#4AD66D" $to="#23C464" $shadow="rgba(35,196,100,.35)">3</StepBadge>
              <StepTextWrap>
                <StepTitle>투두 수행&투둥이 인증</StepTitle>
                <StepText>투두를 실행하면 투둥이로 인증할 수 있어요!</StepText>
              </StepTextWrap>
            </StepItem>

            <StepItem>
              <StepBadge $from="#FFB84D" $to="#FF8C1A" $shadow="rgba(255,140,26,.35)">4</StepBadge>
              <StepTextWrap>
                <StepTitle>커뮤니티 챌린지</StepTitle>
                <StepText>챌린지 목표에 도전하고 더 높은 목표에 도전하세요.</StepText>
              </StepTextWrap>
            </StepItem>
          </StepList>
        </Steps>

        {/* FINAL CTA + LOGIN */}
        <FinalCta id="get-started">
          <FinalTitle>이제 시작해 볼까요?</FinalTitle>
          <Buttons>
            {/* 앱 라우트에 맞게 href 수정 (/login, /signup 등) */}
            <SolidBtn as={Link} to="/auth?mode=login">로그인 하러 가기</SolidBtn>
            <OutlineBtn as={Link} to="/auth?mode=signup">회원가입 하러 가기</OutlineBtn>
          </Buttons>
        </FinalCta>
      </Page>
    </>
  );
};

LandingPage.propTypes = {
  onLoginSuccess: PropTypes.func
};

export default LandingPage;
