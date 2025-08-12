import React, { useState } from "react";
import styled from "styled-components";
import BackgroundAnimation from "./BackgroundAnimation"; // 배경 애니메이션 포함
import UploadModal from "./UploadModal";

const VerifyPage = ({ onNavigate }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handlePhotoClick = () => {
        setShowUploadModal(true);
    };

    const handleUpload = async (formData) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND}/api/verify/photo`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            const result = await res.json();
            alert("업로드 성공!");
            console.log(result);
            setShowUploadModal(false);
        } catch (err) {
            console.error(err);
            alert("업로드 실패");
        }
    };

    return (
        <Wrapper>
            <BackgroundAnimation />
            <Card>
                <Title>어떤 방법으로 인증할까요?</Title>
                <Button className="photo" onClick={handlePhotoClick}>
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

            {/* ✅ 모달 표시 조건 */}
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