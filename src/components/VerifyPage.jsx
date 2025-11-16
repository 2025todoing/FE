import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import BackgroundAnimation from "./BackgroundAnimation"; // 배경 애니메이션 포함
import UploadModal from "./UploadModal";

const VerifyPage = ({ onNavigate }) => {
  const location = useLocation();
  const todoId = location.state?.todoId;
  const category = location.state?.category;

  console.log("받은 카테고리:", category, " / todoId:", todoId);

  const [showUploadModal, setShowUploadModal] = useState(false);

    /*
    * 카테고리 별로 하단에 tip + 추천 인증 방식을 추가할 거에요. 
    */

  const normalizedCategory = String(category || "").trim().toUpperCase();
  console.log("원본 category:", category);
  console.log("정규화 category:", normalizedCategory);

  const getRecommendation = () => {
    switch (normalizedCategory) {
      case "EXERCISE":
        return { method: "...", tip: "..." };

      case "STUDY":
        return { method: "사진 · 손글씨 · 음성 인증 추천!", tip: "공부한 자료나 필기를 촬영하세요! ✏️" };

      case "WORK":
        return { method: "사진 인증 추천!", tip: "업무 환경을 촬영하면 좋아요! 💼" };

      case "HOBBY":
        return { method: "사진 인증 추천!", tip: "취미 활동 중 모습을 찍어보세요! 🎨" };

      default:
        return { method: "추천 없음", tip: "" };
    }

  };

  const { method, tip } = getRecommendation();

    const handlePhotoClick = () => {
        setShowUploadModal(true);
    };

  const handleUpload = async (formData) => {
    if (!todoId) {
      alert("투두 정보가 없습니다. 다시 시도해 주세요.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}/api/verification/${todoId}/vision`, // 🔥 /image 말고 /vision
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            // ❗ Content-Type 넣지 말 것! (FormData가 자동으로 boundary 설정함)
          },
          body: formData,
        }
      );

      console.log("응답 status:", res.status);
      const raw = await res.text();
      console.log("서버 raw 응답:", raw);

      let result;
      try {
        result = JSON.parse(raw);
      } catch {
        result = raw;
      }

      if (!res.ok) {
        alert("업로드 실패 (서버 오류)");
        console.log("서버 오류 내용:", result);
        return;
      }

      // 백엔드 응답 형식에 따라 추가 체크 (예: isSuccess, code 등)
      if (result.isSuccess === false) {
        alert(result.message || "사진 인증에 실패했습니다.");
        return;
      }

      alert("사진 인증 요청이 완료되었습니다! 🎉");
      console.log("최종 응답:", result);

      setShowUploadModal(false);
      // onNavigate("verify-result", { todoId, category }); // 필요하면 추후 연결
    } catch (err) {
      console.error("업로드 에러:", err);
      alert("업로드 실패 (네트워크 오류)");
    }
  };



  return (
    <Wrapper>
      <BackgroundAnimation />
      <Card>
        <Title>어떤 방법으로 인증할까요?</Title>

        {/* ✨ 추천 인증 방식 표시 추가 (카테고리 기반) */}
        {/* 예: category === 'Study' → 손글씨 추천 */}
        {/* 네가 props로 category 넘기면 여기에 표시 가능 */}

        <Recommended>
          <strong>📌 {method}</strong>
          <Tip>{tip}</Tip>
        </Recommended>

        {/* 인증 버튼 목록 */}
        <Button className="photo" onClick={() => setShowUploadModal(true)}>
          사진 인증
        </Button>
        <Button className="handwriting" onClick={() => onNavigate("verify-handwriting")}>
          손글씨 인증
        </Button>
        <Button className="location" onClick={() => onNavigate("verify-location")}>
          위치 인증
        </Button>
        <Button className="voice" onClick={() => onNavigate("verify-voice")}>
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
