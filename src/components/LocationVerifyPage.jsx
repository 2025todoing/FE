import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { toggleTodo } from "../api/todo";

// Kakao REST 키 (Vite의 import.meta.env에서 가져옴)
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Gemini에게 현재 위치가 투두랑 맞는지 물어보기
async function judgeLocationWithGemini({
    todoContent,
    category,
    lat,
    lng,
    places,
}) {
    if (!GEMINI_API_KEY) {
        throw new Error("Gemini API 키가 없습니다 (VITE_GEMINI_API_KEY).");
    }

    const normalizedCategory = String(category || "").trim().toUpperCase();

    // Kakao에서 받은 장소 정보를 텍스트로 요약
    const placesSummary =
        places.length === 0
            ? "주변에 검색된 건물이 거의 없습니다."
            : places
                .map((p, idx) => {
                    const name = p.place_name || "이름 없음";
                    const cate = p.category_name || "카테고리 없음";
                    const dist = p.distance ? `${p.distance}m` : "거리 정보 없음";
                    const addr = p.road_address_name || p.address_name || "";
                    return `${idx + 1}) ${name} / ${cate} / 거리: ${dist}${addr ? ` / 주소: ${addr}` : ""
                        }`;
                })
                .join("\n");

    const prompt = `
당신은 사용자의 투두 실천을 검증하는 심사관입니다.

[투두 내용]
"""${todoContent}"""

[카테고리]
"${normalizedCategory}"

[현재 GPS 좌표]
위도: ${lat}
경도: ${lng}

[현재 위치 주변 건물 정보]
${placesSummary}

판단 기준 (상식적으로 판단하세요):
- EXERCISE: 헬스장, 피트니스 센터, 스포츠 센터, 체육관, 운동 시설 주변이면 MATCH.
- STUDY: 독서실, 도서관, 스터디 카페, 학교(강의동/도서관 등) 주변이면 MATCH.
- WORK: 사무실, 회사 건물, 공유오피스, 업무용 빌딩 주변이면 MATCH.
- HOBBY: 연습실, 공방, 악기 연습실, 취미 학원 등 관련 장소 주변이면 MATCH.
- 그 외에는 해당 투두를 수행하기 어려운 장소라면 MISMATCH.

반드시 아래 중 하나의 단어만 대문자로 출력하세요.
- "MATCH"   : 현재 위치가 이 투두를 수행하기에 적절하다고 판단됨
- "MISMATCH": 현재 위치가 이 투두와 관련 없다고 판단됨

추가 설명, 문장, 이모지, 마크다운 없이
정확히 위 단어들 중 하나만 출력하세요.
`.trim();

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        }
    );

    const result = await response.json();
    console.log("🤖 [위치 인증] Gemini 응답:", result);

    const text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase() ||
        "";

    return text; // "MATCH" 또는 "MISMATCH" 기대
}

async function fetchNearbyPlaces(lat, lng, radius = 500) {
    if (!KAKAO_REST_API_KEY) {
        throw new Error("Kakao REST API 키가 없습니다 (VITE_KAKAO_REST_API_KEY).");
    }

    const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
    url.searchParams.set("query", " ");          // 공백 검색 → 모든 장소 (카테고리 상관X)
    url.searchParams.set("x", String(lng));      // 경도
    url.searchParams.set("y", String(lat));      // 위도
    url.searchParams.set("radius", String(radius)); // m
    url.searchParams.set("sort", "distance");

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
    });

    if (!res.ok) {
        console.error("[Kakao Local] 에러 상태코드:", res.status);
        throw new Error("Kakao Local 호출 실패: " + res.status);
    }

    const data = await res.json();
    console.log("📍 [Kakao 주변 장소] 응답:", data);

    // 최대 5개 정도만 사용
    return (data.documents || []).slice(0, 5);
}


/**
 * 카테고리별로 어떤 키워드로 주변을 검색할지 정의
 * 필요하면 나중에 더 추가 가능
 */

// 카테고리별로 Kakao에 넘길 검색 키워드 정하기
function getKeywordByCategory(normalizedCategory, todoContent) {
    switch (normalizedCategory) {
        case "EXERCISE":
            return "헬스장";
        case "STUDY":
            return "독서실"; // 나중에 도서관/스터디카페로 확장 가능
        case "WORK":
            return "공유오피스";
        case "HOBBY":
            return "연습실";
        default:
            // 투두 내용 안에 단서가 있으면 그걸 사용
            if (todoContent.includes("헬스장")) return "헬스장";
            if (todoContent.includes("도서관")) return "도서관";
            if (todoContent.includes("독서실")) return "독서실";
            // 그래도 없으면 기본은 헬스장
            return "헬스장";
    }
}



async function verifyLocationWithKakao(lat, lng, normalizedCategory, todoContent) {
    if (!KAKAO_REST_API_KEY) {
        alert("Kakao REST API 키(VITE_KAKAO_REST_API_KEY)가 설정되어 있지 않아요.");
        return { isMatch: false, nearbyNames: [] };
    }

    // 🔥 반경을 조금 넉넉하게 (예: 800m)
    const radius = 800;
    const keyword = getKeywordByCategory(normalizedCategory, todoContent);

    const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
    url.searchParams.set("query", keyword);
    url.searchParams.set("x", String(lng)); // 경도
    url.searchParams.set("y", String(lat)); // 위도
    url.searchParams.set("radius", String(radius)); // m
    url.searchParams.set("sort", "distance");

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
    });
    

    if (!res.ok) {
        console.error("[Kakao Local] 에러 상태코드:", res.status);
        return { isMatch: false, nearbyNames: [] };
    }

    const data = await res.json();
    console.log("📍 [Kakao 주변 검색] 응답:", data);

    if (!data.documents || data.documents.length === 0) {
        // 반경 안에 검색 키워드에 맞는 장소가 하나도 없음
        return { isMatch: false, nearbyNames: [] };
    }

    // 제일 가까운 곳 기준으로 거리만 체크 (이름은 굳이 다시 안 거름)
    const nearest = data.documents[0];
    const distance = parseInt(nearest.distance || "999999", 10); // m

    const isCloseEnough = !Number.isNaN(distance) && distance <= radius;

    // 근처 건물 이름들 (최대 3개) -> 실패 시 알려주기용
    const nearbyNames = data.documents.slice(0, 3).map((d) => d.place_name);

    console.log(
        "🏁 가장 가까운 장소:",
        nearest.place_name,
        "거리:",
        distance,
        "m",
        "반경 내?",
        isCloseEnough
    );

    // 🔥 핵심: 카카오가 '헬스장' 근처만 필터링해줬으니까
    // 우리는 거리만 보고 판단한다.
    return { isMatch: isCloseEnough, nearbyNames };
}


const LocationVerifyPage = ({ onNavigate }) => {
    const routerLocation = useLocation();
    const todoId = routerLocation.state?.todoId;
    const category = routerLocation.state?.category;
    const todoContent = routerLocation.state?.content || "";

    const [isVerifying, setIsVerifying] = useState(false);
    const [debugMsg, setDebugMsg] = useState("");
    const [nearbyNames, setNearbyNames] = useState([]);

    const normalizedCategory = String(category || "").trim().toUpperCase();

    // ✅ 투두 완료 + /app/todo 로 이동
    const completeTodoAndGoBack = async () => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return false;
        }

        try {
            const toggleRes = await toggleTodo(todoId, accessToken);
            console.log("✅ [위치 인증] 토글 API 응답:", toggleRes);
            alert("✅ 위치 인증 성공! 투두가 완료 처리됐어요.");
            onNavigate("todo");
            return true;
        } catch (e) {
            console.error("토글 API 실패:", e);
            alert("인증은 성공했지만, 서버에 완료 상태 저장에 실패했습니다.");
            return false;
        }
    };

    // ⭐ 버튼 한 번으로: 현재 위치 → Kakao → MATCH / MISMATCH
    const handleLocationVerify = () => {
        if (!todoContent) {
            alert("투두 내용이 없어 위치와 비교할 수 없어요.");
            return;
        }

        if (!navigator.geolocation) {
            alert("브라우저에서 위치 정보를 지원하지 않아요.");
            return;
        }

        setIsVerifying(true);
        setDebugMsg("📍 현재 위치 가져오는 중...");
        setNearbyNames([]);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                console.log("📍 현재 좌표:", lat, lng);
                setDebugMsg(`현재 좌표: (${lat.toFixed(5)}, ${lng.toFixed(5)}) — 주변 건물 검색 중...`);

                try {
                    // 1) Kakao로 주변 건물 조회
                    const places = await fetchNearbyPlaces(lat, lng, 500);
                    const names = places.map((p) => p.place_name).filter(Boolean);
                    setNearbyNames(names);

                    // 2) Gemini에게 "이 위치가 맞는지" 질문
                    const aiText = await judgeLocationWithGemini({
                        todoContent,
                        category,
                        lat,
                        lng,
                        places,
                    });

                    console.log("📌 [위치 인증] Gemini 결과 텍스트:", aiText);

                    if (aiText === "MATCH") {
                        setDebugMsg("✅ Gemini가 이 위치를 투두에 적절한 장소라고 판단했어요!");
                        await completeTodoAndGoBack();
                    } else if (aiText === "MISMATCH") {
                        setDebugMsg("❌ 이 위치는 투두와 관련 없는 장소로 판단됐어요.");
                        let msg =
                            "❌ 현재 위치가 이 투두를 수행하기에 적절하지 않은 곳이라고 판단됐어요.";

                        if (names.length > 0) {
                            msg += `\n\n📌 현재 근처 예시 장소:\n- ${names.join("\n- ")}`;
                        }

                        alert(msg);
                    } else {
                        setDebugMsg(`⚠️ AI 응답을 해석할 수 없어요. (응답: ${aiText})`);
                        alert(`AI 응답을 해석할 수 없어요. (응답: ${aiText})`);
                    }
                } catch (err) {
                    console.error("[위치 인증] 에러:", err);
                    alert("위치 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
                    setDebugMsg("❌ 위치 분석 중 오류가 발생했습니다.");
                } finally {
                    setIsVerifying(false);
                }
            },
            (err) => {
                console.error("[위치 인증] geolocation 에러:", err);
                alert("위치 정보를 가져오지 못했어요. 권한을 허용했는지 확인해 주세요.");
                setDebugMsg("❌ 위치 가져오기 실패");
                setIsVerifying(false);
            }
        );
    };

    // 맨 아래 취소 버튼: 인증 방법 선택 화면으로 돌아가기
    const handleCancel = () => {
        onNavigate("verify", {
            todoId,
            category,
            content: todoContent,
        });
    };

    return (
        <Wrapper>
            <Card>
                <Title>📍 위치로 인증하기</Title>

                <TodoInfo>
                    <strong>투두 내용</strong>
                    <p>{todoContent || "내용 없음"}</p>
                    <small>카테고리: {category || "없음"}</small>
                </TodoInfo>

                <Button className="verify" onClick={handleLocationVerify} disabled={isVerifying}>
                    {isVerifying ? "위치 확인 중..." : "현재 위치로 인증하기"}
                </Button>

                {debugMsg && <DebugText>{debugMsg}</DebugText>}

                {nearbyNames.length > 0 && (
                    <NearbyBox>
                        <span>📌 근처에서 찾은 장소 예시</span>
                        <ul>
                            {nearbyNames.map((name) => (
                                <li key={name}>{name}</li>
                            ))}
                        </ul>
                    </NearbyBox>
                )}

                <CancelButton onClick={handleCancel}>취소 (이전으로)</CancelButton>
            </Card>
        </Wrapper>
    );
};

export default LocationVerifyPage;

/* ===== styled-components ===== */

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6fb;
  font-family: "SCDream", sans-serif;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
  width: 90%;
  max-width: 480px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 1.8rem;
`;

const TodoInfo = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
  background: #f7f9ff;
  padding: 1rem;
  border-radius: 12px;

  p {
    margin: 0.3rem 0 0.2rem;
  }

  small {
    color: #666;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1.1rem;
  margin: 0.5rem 0 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
  background-color: #9fd0ff;

  &:hover {
    filter: brightness(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DebugText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #777;
`;

const NearbyBox = styled.div`
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  background: #f3fff2;
  border-radius: 10px;
  text-align: left;
  font-size: 0.9rem;
  color: #333;

  span {
    font-weight: 600;
  }

  ul {
    margin: 0.5rem 0 0;
    padding-left: 1.1rem;
  }

  li + li {
    margin-top: 0.2rem;
  }
`;

const CancelButton = styled.button`
  margin-top: 1.5rem;
  border: none;
  background: none;
  color: #888;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
`;
