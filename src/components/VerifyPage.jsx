import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import BackgroundAnimation from "./BackgroundAnimation";
import UploadModal from "./UploadModal";
import { toggleTodo } from "../api/todo"; // ✅ 추가

const VerifyPage = ({ onNavigate }) => {
  const location = useLocation();
  const todoId = location.state?.todoId;
  const category = location.state?.category;

  console.log("받은 카테고리:", category, " / todoId:", todoId);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // 카테고리 정규화
  const normalizedCategory = String(category || "").trim().toUpperCase();
  console.log("원본 category:", category);
  console.log("정규화 category:", normalizedCategory);

  // 카테고리별 추천 문구
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

  const handlePhotoClick = () => {
    setShowUploadModal(true);
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

  const handleUpload = async (file) => {
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
          "공부(책, 노트 필기, 문제집, 교과서, 공부하는 책상, 랩탑과 노트 등)에 해당하면 MATCH 입니다.",
        WORK:
          "업무(사무실, 노트북, 모니터, 회의실, 서류, 작업 환경 등)에 해당하면 MATCH 입니다.",
        HOBBY:
          "취미(그림, 악기, 운동, 게임 장비, 공예, 만들기, 취미 활동 장면 등)에 해당하면 MATCH 입니다.",
      }[normalizedCategory] || "";

      const systemPrompt = `
사용자의 투두 카테고리는 "${normalizedCategory}" 입니다.
이미지를 보고 이 카테고리와 실제로 관련 있는 장면인지 판단해 주세요.

${categoryExplanation}

아래 규칙을 반드시 지켜서 한 단어로만 대답하세요.
- 관련이 명확하면: "MATCH"
- 관련이 없거나 애매하면: "MISMATCH"

추가 설명, 마크다운, 문장, 이모지 없이
정확히 대문자 알파벳 한 단어만 출력하세요.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  {
                    inline_data: {
                      mime_type: file.type || "image/jpeg",
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
      console.log("📸 Gemini 응답:", result);

      const aiText =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      console.log("📌 Gemini 결과 텍스트:", aiText);

      if (aiText === "MATCH") {
        // ✅ 1) 백엔드 토글 호출
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          alert("로그인이 필요합니다.");
          return;
        }

        try {
          const toggleRes = await toggleTodo(todoId, accessToken);
          console.log("✅ 토글 API 응답:", toggleRes);
        } catch (e) {
          console.error("토글 API 실패:", e);
          alert("인증은 성공했지만, 서버에 완료 상태 저장에 실패했습니다.");
          return;
        }

        alert("✅ 인증 성공! 투두가 완료 처리됐어요.");
        setShowUploadModal(false);

        // ✅ 2) 투두 페이지로 돌아가기
        onNavigate("todo"); // /app/todo 로 이동
      } else if (aiText === "MISMATCH") {
        alert("❌ 사진이 이 투두 내용과 관련 없다고 나왔어요. 다시 찍어볼까요?");
      } else {
        alert(`AI 응답을 해석할 수 없어요. (응답: ${aiText})`);
      }
    } catch (err) {
      console.error("Gemini 업로드/분석 에러:", err);
      alert("사진 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsVerifying(false);
    }
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

        <Button className="photo" onClick={handlePhotoClick} disabled={isVerifying}>
          {isVerifying ? "사진 인증 중..." : "사진 인증"}
        </Button>
        <Button
          className="handwriting"
          onClick={() => onNavigate("verify-handwriting")}
          disabled={isVerifying}
        >
          손글씨 인증
        </Button>
        <Button
          className="location"
          onClick={() => onNavigate("verify-location")}
          disabled={isVerifying}
        >
          위치 인증
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
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}
    </Wrapper>
  );
};

export default VerifyPage;

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
