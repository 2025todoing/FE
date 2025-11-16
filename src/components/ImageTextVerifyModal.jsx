// src/components/ImageTextVerifyModal.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { toggleTodo } from "../api/todo";

const GEMINI_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const ImageTextVerifyModal = ({
    open,
    onClose,
    todoId,
    todoContent,   // "자료구조 10주차 학습하기" 이런 문자열
    onVerified,    // 인증 성공 후 콜백 (ex. 투두 페이지로 이동, 리스트 리프레시 등)
}) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState("");

    if (!open) return null;

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setResultText("");
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(",")[1]; // "data:...;base64," 제거
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const callGemini = async (base64Image) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `
당신은 투두 인증을 도와주는 검사관입니다.

1. 이미지를 보고 안에 있는 글(또는 장면)을 기반으로, 아래 "할 일 내용"과 얼마나 관련 있는지 0~100점으로 평가하세요.
2. 70점 이상이면 pass, 아니면 fail 입니다.
3. JSON 형식으로만 답하세요.

{
  "score": number,
  "pass": boolean,
  "reason": "간단한 한국어 설명"
}
              `.trim(),
                            },
                            { text: `할 일 내용: ${todoContent}` },
                            {
                                inlineData: {
                                    mimeType: file.type || "image/png",
                                    data: base64Image,
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    temperature: 0.2,
                },
            }),
        });

        const data = await res.json();
        const rawText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

        // 모델이 ```json 같은 걸 붙여도 최대한 JSON만 뽑아내기
        let jsonStr = rawText.trim();
        const firstBrace = jsonStr.indexOf("{");
        const lastBrace = jsonStr.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
        }

        return JSON.parse(jsonStr); // { score, pass, reason }
    };

    const handleVerify = async () => {
        if (!file) {
            alert("사진을 먼저 선택해 주세요!");
            return;
        }
        if (!todoId || !todoContent) {
            alert("투두 정보가 없습니다. 다시 시도해 주세요.");
            return;
        }

        try {
            setLoading(true);
            setResultText("AI가 사진을 분석 중입니다...");

            // 1) 이미지 → base64
            const base64 = await fileToBase64(file);

            // 2) Gemini로 관련성 평가
            const aiResult = await callGemini(base64);
            console.log("Gemini 결과:", aiResult);

            setResultText(
                `점수: ${aiResult.score} / 100\n결과: ${aiResult.pass ? "PASS ✅" : "FAIL ❌"
                }\n이유: ${aiResult.reason || "사유 없음"}`
            );

            // 3) 통과하면 백엔드 토글 호출
            if (aiResult.pass) {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    alert("로그인이 필요합니다.");
                    return;
                }

                const toggleRes = await toggleTodo(todoId, token);
                console.log("toggleTodo 응답:", toggleRes);

                alert("사진 인증에 성공했어요! ✅");
                onVerified && onVerified(); // 예: 투두 페이지로 이동, 리스트 새로고침 등
                onClose();
            } else {
                alert("사진 내용이 투두와 충분히 관련이 없다고 판단했어요 ㅠㅠ");
            }
        } catch (err) {
            console.error("사진 인증 오류:", err);
            alert("사진 인증 중 오류가 발생했어요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Overlay>
            <ModalBox>
                <Title>사진으로 인증하기</Title>
                <TodoTextBox>📌 할 일: {todoContent}</TodoTextBox>

                <InputLabel>사진 업로드</InputLabel>
                <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                />

                {previewUrl && (
                    <PreviewImg src={previewUrl} alt="preview" />
                )}

                {resultText && (
                    <ResultBox>
                        {resultText.split("\n").map((line, idx) => (
                            <div key={idx}>{line}</div>
                        ))}
                    </ResultBox>
                )}

                <ButtonRow>
                    <Button type="button" onClick={onClose} disabled={loading}>
                        취소
                    </Button>
                    <PrimaryButton
                        type="button"
                        onClick={handleVerify}
                        disabled={loading || !file}
                    >
                        {loading ? "인증 중..." : "AI로 인증하기"}
                    </PrimaryButton>
                </ButtonRow>
            </ModalBox>
        </Overlay>
    );
};

export default ImageTextVerifyModal;

// ---------- styled ----------

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalBox = styled.div`
  width: min(90vw, 480px);
  background: #ffffff;
  border-radius: 18px;
  padding: 1.8rem 1.6rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.18);
  font-family: "SCDream", sans-serif;
`;

const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  text-align: center;
`;

const TodoTextBox = styled.div`
  font-size: 0.95rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  background: #f7f8ff;
  margin-bottom: 1rem;
  color: #333;
`;

const InputLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
`;

const FileInput = styled.input`
  width: 100%;
  margin-bottom: 0.8rem;
`;

const PreviewImg = styled.img`
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 0.8rem;
  border: 1px solid #eee;
`;

const ResultBox = styled.div`
  margin-top: 0.4rem;
  padding: 0.7rem 0.8rem;
  border-radius: 10px;
  background: #f0f4ff;
  font-size: 0.85rem;
  white-space: pre-wrap;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 1.1rem;
`;

const Button = styled.button`
  padding: 0.6rem 1.1rem;
  border-radius: 999px;
  border: none;
  background: #eeeeee;
  cursor: pointer;
  font-weight: 600;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(45deg, #4f87ff, #b344e2);
  color: #fff;
`;

