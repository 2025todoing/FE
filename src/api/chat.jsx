// src/api/chat.jsx
import axios from './axio';

// =============================
// Mock 모드 설정
// =============================
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

if (USE_MOCK) {
  console.warn('🎬 MOCK MODE 활성화 - 백엔드 없이 데모 동작합니다!');
} else {
  console.log('✅ REAL MODE - 백엔드와 연동됩니다.');
}

// =============================
// Mock 상태 관리 (모듈 레벨 클로저)
// =============================
const mockState = {
  turnCount: 0,
  lastResponseId: null,
  pendingResponse: null,
  responseReady: false
};

// =============================
// Mock 대화 시나리오
// =============================
const getMockDialogue = (turn) => {
  const scenarios = [
    // 턴 1: 첫 인사
    {
      type: "message",
      message: "안녕! 나는 투둥이야 🐾 할 일 계획을 세우는 걸 도와줄게! 무엇을 도와드릴까요?"
    },
    // 턴 2: 목표 확인
    {
      type: "message",
      message: "좋아요! 어떤 목표를 달성하고 싶으세요? 예를 들어 '운동', '공부', '프로젝트' 같은 거요!"
    },
    // 턴 3: 기간 확인
    {
      type: "message",
      message: "멋진 목표네요! 👏 이 목표를 위해 얼마 동안 계획을 세우고 싶으세요?"
    },
    // 턴 4: PLAN 생성! 🎉
    {
      type: "plan",
      mainQuest: "🎯 2주 완성 목표: 매일 꾸준히 실천하기",
      subQuests: [
        { date: "1주차 월", task: "목표 설정하고 계획 점검하기" },
        { date: "1주차 화", task: "첫 번째 액션 아이템 실행" },
        { date: "1주차 수", task: "진행 상황 체크 및 조정" },
        { date: "1주차 목", task: "중간 점검 및 피드백" },
        { date: "1주차 금", task: "1주차 마무리 및 회고" },
        { date: "2주차 월", task: "2주차 시작 - 페이스 조정" },
        { date: "2주차 화", task: "집중 실행 타임" },
        { date: "2주차 수", task: "최종 스퍼트 준비" },
        { date: "2주차 목", task: "목표 달성 확인" },
        { date: "2주차 금", task: "🎊 완료! 다음 목표 설정" }
      ]
    },
    // 턴 5 이후: 추가 대화
    {
      type: "message",
      message: "계획을 잘 따라가고 있나요? 다른 도움이 필요하면 언제든 말해주세요! 💪"
    },
    {
      type: "message",
      message: "화이팅이에요! 꾸준히 하다 보면 반드시 목표를 달성할 수 있을 거예요! 🌟"
    }
  ];

  // 턴이 시나리오 범위를 벗어나면 마지막 메시지 반복
  if (turn > scenarios.length) {
    return {
      type: "message",
      message: "또 다른 계획을 세우고 싶으시면 언제든 말씀해주세요! 😊"
    };
  }

  return scenarios[turn - 1];
};

// =============================
// API 함수: postChatMessage
// =============================
export const postChatMessage = async (message, token) => {
  if (USE_MOCK) {
    console.log('[MOCK] 유저 메시지:', message);

    // 턴 증가 및 응답 준비
    mockState.turnCount++;
    mockState.pendingResponse = getMockDialogue(mockState.turnCount);
    mockState.responseReady = true;

    // 약간의 지연 (실제 API 느낌)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isSuccess: true,
          message: 'Message received'
        });
      }, 200);
    });
  }

  // =============================
  // REAL API
  // =============================
  const body = {
    messages: [
      {
        role: "user",
        content: message
      }
    ]
  };

  const response = await axios.post('/chat/message', body, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

// =============================
// API 함수: getChatResult
// =============================
export const getChatResult = async (token) => {
  if (USE_MOCK) {
    // 준비된 응답이 없으면 빈 응답
    if (!mockState.responseReady || !mockState.pendingResponse) {
      return { isSuccess: false };
    }

    const responseId = `mock-turn-${mockState.turnCount}`;

    // 중복 응답 방지 (이미 반환한 응답은 다시 안 줌)
    if (mockState.lastResponseId === responseId) {
      return { isSuccess: false };
    }

    // 응답 준비
    mockState.lastResponseId = responseId;
    const response = mockState.pendingResponse;

    // 응답 플래그 리셋 (한 번만 반환)
    mockState.responseReady = false;
    mockState.pendingResponse = null;

    console.log('[MOCK] GPT 응답:', response.type, response.type === 'plan' ? '(계획 생성!)' : '');

    // 약간의 지연 (GPT 처리 시간 시뮬레이션)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isSuccess: true,
          result: {
            id: responseId,
            prompt: JSON.stringify(response)
          }
        });
      }, 900);
    });
  }

  // =============================
  // REAL API
  // =============================
  const response = await axios.get('/chat/result', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// =============================
// API 함수: saveChatPlan
// =============================
export const saveChatPlan = async (planData, token) => {
  if (USE_MOCK) {
    console.log('[MOCK] 계획 저장됨:', planData);

    // 저장 시뮬레이션 지연
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          isSuccess: true,
          message: 'Plan saved successfully'
        });
      }, 500);
    });
  }

  // =============================
  // REAL API
  // =============================
  const response = await axios.post('/api/todos/chat', planData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

// =============================
// 기타 API: sendChatSetting
// =============================
export const sendChatSetting = async (settingData, token) => {
  if (USE_MOCK) {
    console.log('[MOCK] 설정 저장됨:', settingData);
    return { isSuccess: true };
  }

  const response = await axios.post('/chat/setting', settingData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};
