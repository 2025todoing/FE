import React, { useState } from "react";
import styled from "styled-components";

const UploadModal = ({ onClose, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            onUpload(formData); // 상위에서 API 요청
        }
    };

    return (
        <Overlay>
            <ModalContent>
                <h3>사진을 업로드해주세요</h3>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <div className="buttons">
                    <button onClick={handleUpload}>업로드</button>
                    <button onClick={onClose}>취소</button>
                </div>
            </ModalContent>
        </Overlay>
    );
};

export default UploadModal;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  font-family: 'SCDream', sans-serif;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
  }

  input[type="file"] {
    margin: 1rem 0;
  }

  .buttons {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 8px;
    background: #f0f0f0;
    font-weight: bold;
    cursor: pointer;
  }
`;