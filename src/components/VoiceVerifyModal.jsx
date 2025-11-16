// src/components/VoiceVerifyModal.jsx
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { toggleTodo } from "../api/todo";

const VoiceVerifyModal = ({ todoId, todoContent, category, onClose, onSuccess }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const recordedBlobRef = useRef(null);

    const normalizedCategory = String(category || "").trim().toUpperCase();

    const startRecording = async () => {
        if (isRecording) return;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("이 브라우저에서는 마이크 녹음을 지원하지 않아요 😢");
            return;
        }

        try {
            setErrorMsg("");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach((t) => t.stop());
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                recordedBlobRef.current = blob;
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);

            // 1분 지나면 자동 STOP
            timerRef.current = setTimeout(() => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop();
                    setIsRecording(false);
                }
            }, 60_000);
        } catch (err) {
            console.error("🎙️ 녹음 시작 에러:", err);
            alert("마이크 권한을 허용해 주세요.");
        }
    };

    const stopRecording = () => {
        if (!isRecording || !mediaRecorderRef.current) return;
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    const blobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result;
                const base64 = result.split(",")[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    const handleVerify = async () => {
        if (!recordedBlobRef.current) {
            setErrorMsg("먼저 음성을 녹음해 주세요.");
            return;
        }

        if (!todoContent || !todoContent.trim()) {
            alert("할 일 내용이 없어 음성과의 관련성을 판단할 수 없어요.");
            return;
        }

        if (!import.meta.env.VITE_GEMINI_API_KEY) {
            alert("Gemini API 키가 설정되어 있지 않습니다. (.env 확인)");
            return;
        }

        try {
            setIsVerifying(true);
            setErrorMsg("");

            const base64Audio = await blobToBase64(recordedBlobRef.current);

            const systemPrompt = `
당신은 음성과 텍스트의 관련성을 판단하는 심사관입니다.

[투두 내용]
${todoContent}

[카테고리]
${normalizedCategory}

사용자가 말한 음성의 내용이 위 투두를 정말 수행한 내용인지, 혹은 매우 밀접하게 관련된 내용인지 판단해 주세요.

규칙:
- 투두 내용과 뚜렷하게 관련 있으면: "MATCH"
- 전혀 다르거나 애매하면: "MISMATCH"

반드시 아래처럼 한 단어만, 대문자로만 출력하세요.
MATCH
또는
MISMATCH
추가 설명, 문장, 이모지 절대 금지.
`;

            const res = await fetch(
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
                                            mime_type: "audio/webm",
                                            data: base64Audio,
                                        },
                                    },
                                ],
                            },
                        ],
                    }),
                }
            );

            const result = await res.json();
            console.log("🎧 Gemini 음성 응답:", result);

            const aiText =
                result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

            console.log("📌 Gemini 결과 텍스트:", aiText);

            if (aiText === "MATCH") {
                // ✅ 백엔드 토글
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) {
                    alert("로그인이 필요합니다.");
                    return;
                }

                try {
                    const toggleRes = await toggleTodo(todoId, accessToken);
                    console.log("✅ 음성 인증 토글 응답:", toggleRes);
                } catch (e) {
                    console.error("토글 API 실패:", e);
                    alert("인증은 성공했지만, 서버에 완료 상태 저장에 실패했습니다.");
                    return;
                }

                alert("✅ 음성 인증 성공! 투두가 완료 처리됐어요.");
                onClose();
                onSuccess && onSuccess(); // 보통 /app/todo 로 이동
            } else if (aiText === "MISMATCH") {
                setErrorMsg("❌ 말한 내용이 투두와 관련 없다고 판단됐어요. 다시 시도해 볼까요?");
            } else {
                setErrorMsg(`AI 응답을 해석할 수 없어요. (응답: ${aiText})`);
            }
        } catch (err) {
            console.error("🎧 Gemini 음성 분석 에러:", err);
            setErrorMsg("음성 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Overlay>
            <ModalBox>
                <Title>🎙️ 음성으로 인증하기</Title>
                <Desc>
                    1분 이내로 오늘 한 내용을 말해 주세요.<br />
                    예: "{todoContent || "오늘 한 일을 자세히 말해 주세요."}"
                </Desc>

                <RecordBox>
                    {!isRecording ? (
                        <RecordButton onClick={startRecording} disabled={isVerifying}>
                            녹음 시작
                        </RecordButton>
                    ) : (
                        <StopButton onClick={stopRecording}>
                            녹음 종료 (최대 1분)
                        </StopButton>
                    )}

                    {audioUrl && (
                        <AudioPreview>
                            <span>내 녹음 미리 듣기</span>
                            <audio controls src={audioUrl} />
                        </AudioPreview>
                    )}
                </RecordBox>

                {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

                <ButtonRow>
                    <CancelButton onClick={onClose} disabled={isVerifying}>
                        취소
                    </CancelButton>
                    <SubmitButton onClick={handleVerify} disabled={isVerifying}>
                        {isVerifying ? "AI가 확인 중..." : "AI에게 확인 받기"}
                    </SubmitButton>
                </ButtonRow>
            </ModalBox>
        </Overlay>
    );
};

export default VoiceVerifyModal;

// ===== styled-components =====

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 2rem 1.8rem;
  width: 90%;
  max-width: 420px;
  font-family: 'SCDream', sans-serif;
  box-shadow: 0 12px 30px rgba(0,0,0,0.18);
`;

const Title = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
`;

const Desc = styled.p`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1.2rem;
  line-height: 1.5;
`;

const RecordBox = styled.div`
  border-radius: 12px;
  padding: 1rem;
  background: #f8f9ff;
  margin-bottom: 1rem;
  text-align: center;
`;

const BaseButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.4rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  font-family: 'SCDream', sans-serif;
  transition: 0.2s;
`;

const RecordButton = styled(BaseButton)`
  background: #ffb7b2;
  &:hover { filter: brightness(0.95); }
`;

const StopButton = styled(BaseButton)`
  background: #ff6f61;
  color: #fff;
  &:hover { filter: brightness(0.95); }
`;

const AudioPreview = styled.div`
  margin-top: 0.8rem;
  text-align: left;

  span {
    font-size: 0.9rem;
    color: #444;
    display: block;
    margin-bottom: 0.3rem;
  }

  audio {
    width: 100%;
  }
`;

const ErrorText = styled.div`
  color: #ff4b4b;
  font-size: 0.85rem;
  margin-bottom: 0.6rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.8rem;
`;

const CancelButton = styled(BaseButton)`
  background: #eee;
`;

const SubmitButton = styled(BaseButton)`
  background: linear-gradient(45deg, #4F87FF, #B344E2);
  color: #fff;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
