import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import BackgroundAnimation from "./BackgroundAnimation";
import UploadModal from "./UploadModal";
import { toggleTodo } from "../api/todo";

const VerifyPage = ({ onNavigate }) => {
  const location = useLocation();
  const todoId = location.state?.todoId;
  const category = location.state?.category;
  const todoContent = location.state?.content || ""; // ✅ 투두 실제 내용

  console.log("받은 카테고리:", category, " / todoId:", todoId, " / content:", todoContent);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState(null); // 'photo' | 'handwriting'
  const [isVerifying, setIsVerifying] = useState(false);

  // 카테고리 정규화 (추천 문구용)
  const normalizedCategory = String(category || "").trim().toUpperCase();

  const getRecommendation = () => {
    switch (normalizedCategory) {
      case "EXERCISE":
        return {
          method: "위치 · 사진 인증 추천!",
          tip: "헬스장, 러닝머신, 운동 기구 등 운동하는 장면이 잘 보이게 찍어주세요! 🏋️‍♂️",
        };
      case "STUDY":
        return {
          method: "사진 · 손글씨 · 음성 인증 추천!",
          tip: "교재, 노트 필기, 문제집 등 공부 흔적이 보이게 촬영해 주세요! ✏️",
        };
      case "WORK":
        return {
          method: "사진 인증 추천!",
          tip: "노트북, 모니터, 책상, 회의실 등 업무 환경을 찍으면 좋아요! 💼",
        };
      case "HOBBY":
        return {
          method: "사진 인증 추천!",
          tip: "취미 활동 중인 모습을 찍어보세요! 🎨",
        };
      default:
        return {
          method: "추천 없음",
          tip: "투두 카테고리를 기준으로 인증을 추천해 드릴게요.",
        };
    }
  };

  const { method, tip } = getRecommendation();

  const openPhotoModal = () => {
    setUploadMode("photo");
    setShowUploadModal(true);
  };

  const openHandwritingModal = () => {
    setUploadMode("handwriting");
    setShowUploadModal(true);
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setUploadMode(null);
  };

  // File -> base64
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ✅ 공통: 토글 + 페이지 이동
  const completeTodoAndGoBack = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return false;
    }

    try {
      const toggleRes = await toggleTodo(todoId, accessToken);
      console.log("✅ 토글 API 응답:", toggleRes);
      alert("✅ 인증 성공! 투두가 완료 처리됐어요.");
      closeModal();
      onNavigate("todo"); // /app/todo 로 이동
      return true;
    } catch (e) {
      console.error("토글 API 실패:", e);
      alert("인증은 성공했지만, 서버에 완료 상태 저장에 실패했습니다.");
      return false;
    }
  };

  // =========================
  // 1) 사진 인증 (카테고리 기반)
  // =========================
  const handlePhotoUpload = async (file) => {
    if (!file) {
      alert("사진 파일을 다시 선택해 주세요.");
      return;
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      alert("Gemini API 키가 설정되어 있지 않습니다. (.env 확인)");
      return;
    }

    try {
      setIsVerifying(true);

      const base64Image = await fileToBase64(file);

      const categoryExplanation = {
        EXERCISE:
          "운동(헬스장, 러닝, 요가, 피트니스, 운동기구, 체육관 등)에 해당하면 MATCH 입니다.",
        STUDY:
          "공부(책상 위 교재, 노트 필기, 문제집, 강의자료, 노트북으로 공부하는 장면 등)에 해당하면 MATCH 입니다.",
        WORK:
          "업무(사무실, 노트북, 모니터, 회의실, 회의하는 사람들, 서류 작업 등)에 해당하면 MATCH 입니다.",
        HOBBY:
          "취미(그림 그리기, 악기 연주, 운동, 게임 장비, 공예/만들기 등 즐거운 활동)라면 MATCH 입니다.",
      }[normalizedCategory] || "";

      const systemPrompt = `
사용자의 투두 카테고리는 "${normalizedCategory}" 입니다.
이미지를 보고 이 카테고리와 실제로 관련 있는 장면인지 판단해 주세요.

${categoryExplanation}

아래 규칙을 반드시 지켜서 한 단어로만 대답하세요.
- 카테고리와 관련이 명확하면: "MATCH"
- 관련이 없거나 애매하면: "MISMATCH"

추가 설명, 마크다운, 문장, 이모지 없이
정확히 대문자 알파벳 한 단어만 출력하세요.
`.trim();

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  {
                    inlineData: {
                      mimeType: file.type || "image/jpeg",
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const result = await response.json();
      console.log("📸 [사진 인증] Gemini 응답:", result);

      const aiText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase() ||
        "";

      console.log("📌 [사진 인증] 결과 텍스트:", aiText);

      if (aiText === "MATCH") {
        await completeTodoAndGoBack();
      } else if (aiText === "MISMATCH") {
        alert("❌ 사진이 이 투두의 카테고리와 관련 없다고 나왔어요. 다른 사진으로 다시 시도해 볼까요?");
      } else {
        alert(`AI 응답을 해석할 수 없어요. (응답: ${aiText})`);
      }
    } catch (err) {
      console.error("[사진 인증] Gemini 에러:", err);
      alert("사진 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  // =========================
  // 2) 손글씨 인증 (텍스트 vs content)
  // =========================
  const handleHandwritingUpload = async (file) => {
    if (!file) {
      alert("사진 파일을 다시 선택해 주세요.");
      return;
    }

    if (!todoContent) {
      alert("할 일 내용이 없어 손글씨와의 관련성을 판단할 수 없어요.");
      return;
    }

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      alert("Gemini API 키가 설정되어 있지 않습니다. (.env 확인)");
      return;
    }

    try {
      setIsVerifying(true);

      const base64Image = await fileToBase64(file);

      const systemPrompt = `
당신은 투두 인증을 도와주는 검사관입니다.

아래 "할 일 내용"은 사용자가 오늘 하려는 공부/작업 목표입니다.
이미지를 보고 안에 적힌 손글씨/텍스트(필기, 책 페이지, 문제, 코드 등)를 읽고,
실제 내용이 할 일 내용과 같은 과목/주제/단원/개념에 대한 공부인지 판단하세요.

할 일 내용: """${todoContent}"""

판단 단계:
1단계) 이 이미지에 눈에 띄는 손글씨나 텍스트가 충분히 있는지 확인하세요.
2단계) 텍스트가 있다면, 그 내용이 할 일 내용과 같은 과목/주제/단원/개념에 대한 공부인지 확인하세요.

반드시 아래 중 하나의 단어만 출력하세요.
- "MATCH"      : 텍스트가 있고, 내용이 할 일과 분명히 관련 있음
- "MISMATCH"   : 텍스트가 있지만, 할 일 내용과 관련 없음
- "NO_TEXT"    : 손글씨나 텍스트가 거의 없거나, 잘 보이지 않아서 읽기 어려움

추가 설명, 마크다운, 이모지, 문장 없이
위 단어 중 하나만 대문자로 출력하세요.
`.trim();

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  {
                    inlineData: {
                      mimeType: file.type || "image/jpeg",
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const result = await response.json();
      console.log("📝 [손글씨 인증] Gemini 응답:", result);

      const aiText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase() ||
        "";

      console.log("📌 [손글씨 인증] 결과 텍스트:", aiText);

      if (aiText === "MATCH") {
        await completeTodoAndGoBack();
      } else if (aiText === "MISMATCH") {
        alert("❌ 손글씨 내용이 이 투두 내용과 관련 없다고 나왔어요. 다시 작성해 볼까요?");
      } else if (aiText === "NO_TEXT") {
        alert(
          "📷 이 사진에서는 손글씨나 텍스트가 잘 보이지 않아요.\n" +
          "이 경우에는 '손글씨 인증'보다는 '사진 인증'으로 시도하는 게 더 정확해요!"
        );
        // 여기서 바로 사진 인증으로 돌리고 싶다면:
        // await handlePhotoUpload(file);
      } else {
        alert(`AI 응답을 해석할 수 없어요. (응답: ${aiText})`);
      }
    } catch (err) {
      console.error("[손글씨 인증] Gemini 에러:", err);
      alert("손글씨 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 모달에서 실제로 호출되는 업로드 핸들러
  const handleUploadFromModal = (file) => {
    if (uploadMode === "photo") {
      return handlePhotoUpload(file);
    }
    if (uploadMode === "handwriting") {
      return handleHandwritingUpload(file);
    }
    console.warn("uploadMode가 설정되지 않았습니다.");
  };

  return (
    <Wrapper>
      <BackgroundAnimation />
      <Card>
        <Title>어떤 방법으로 인증할까요?</Title>

        <Recommended>
          <strong>📌 {method}</strong>
          <Tip>{tip}</Tip>
        </Recommended>

        {/* ✅ 사진 인증: 카테고리 기반 */}
        <Button className="photo" onClick={openPhotoModal} disabled={isVerifying}>
          {isVerifying && uploadMode === "photo" ? "사진 인증 중..." : "사진 인증"}
        </Button>

        {/* ✅ 손글씨 인증: 글 내용 vs todoContent */}
        <Button
          className="handwriting"
          onClick={openHandwritingModal}
          disabled={isVerifying}
        >
          {isVerifying && uploadMode === "handwriting"
            ? "손글씨 인증 중..."
            : "손글씨 인증"}
        </Button>

        <Button
          className="location"
          onClick={() => onNavigate("verify-location")}
          disabled={isVerifying}
        >
          위치 인증 - 오픈 예정
        </Button>
        <Button
          className="voice"
          onClick={() => onNavigate("verify-voice")}
          disabled={isVerifying}
        >
          음성 인증
        </Button>
      </Card>

      {showUploadModal && (
        <UploadModal
          onClose={closeModal}
          onUpload={handleUploadFromModal} // ✅ 모달은 공통, 내부에서 mode에 따라 분기
        />
      )}
    </Wrapper>
  );
};

export default VerifyPage;

/* ===== styled ===== */

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: 'SCDream', sans-serif;
`;

const Card = styled.div`
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.1);
  z-index: 1;
  width: 90%;
  max-width: 500px;
  text-align: center;
  font-family: 'SCDream', sans-serif;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 2rem;
  font-family: 'SCDream', sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 1.2rem;
  margin: 0.6rem 0;
  border: none;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: 'SCDream', sans-serif;
  cursor: pointer;
  transition: background 0.2s ease;

  &.photo {
    background-color: #f8d8c4;
  }

  &.handwriting {
    background-color: #fef3b3;
  }

  &.location {
    background-color: #c9edc8;
  }

  &.voice {
    background-color: #cddcff;
  }

  &:hover {
    filter: brightness(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Recommended = styled.div`
  margin-bottom: 1rem;
  padding: 0.7rem;
  background: #e8f3ff;
  border-radius: 10px;
  color: #0077cc;
  font-weight: bold;
`;

const Tip = styled.div`
  margin-top: 0.4rem;
  color: #555;
  font-size: 0.9rem;
  font-weight: normal;
`;
