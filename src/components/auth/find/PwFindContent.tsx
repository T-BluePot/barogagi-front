import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PwFindContent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!phoneNumber.trim()) {
      alert("휴대전화 번호를 입력해주세요.");
      return;
    }

    // 공통 인증 페이지로 이동 (reset-password flow)
    navigate("/verify/reset-password", {
      state: { phone: phoneNumber, flow: "reset-password" },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          본인 확인을 위해
          <br />
          휴대폰 번호를 입력해주세요
        </h2>
        <p className="text-gray-400 text-sm">
          가입 시 등록한 번호로 인증번호를 보내드려요
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-lime-400 mb-2">
            휴대전화 번호
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="010-1234-5678"
            className="w-full bg-transparent border-b border-gray-600 text-white text-lg pb-2 focus:border-lime-400 focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-lime-400 text-black font-medium py-4 rounded-full hover:bg-lime-500 transition-colors"
      >
        본인 인증하기
      </button>
    </div>
  );
};

export default PwFindContent;
