import { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SmallButton from "@/components/common/buttons/SmallButton";

type InputType = "text" | "password" | "tel" | "email" | "number";

interface CommonInputProps {
  label: string;
  placeholder: string;
  helperText?: string;
  error?: boolean;
  value: string; // 현재 값
  setValue: (next: string) => void; // 값 변경 함수
  withButton?: boolean;
  onClickButton?: () => void;
  type?: InputType;
}

export const CommonInput = ({
  label,
  placeholder,
  helperText,
  error = false,
  value,
  setValue,
  withButton = false,
  onClickButton,
  type = "text",
}: CommonInputProps) => {
  // 비밀번호 보이기/숨기기 상태 관리
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 가시성 토글 핸들러
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // 입력 변경 핸들러 (전화번호인 경우 숫자만 허용)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // tel 타입일 경우 숫자만 허용
    if (type === "tel") {
      const onlyNumbers = input.replace(/\D/g, "");
      setValue(onlyNumbers);
    } else {
      setValue(input);
    }
  };

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      value={value}
      onChange={handleChange}
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      inputMode={type === "tel" ? "numeric" : undefined}
      variant="filled"
      slotProps={{
        root: {
          sx: {
            "& .MuiFilledInput-root": {
              minHeight: 60,
              "&:before": { borderBottomColor: "#676767" },
              "&:hover:before": { borderBottomColor: "#8ed71b" },
              "&.Mui-focused:after": { borderBottomColor: "#bafd4f" },
            },
          },
        },
        input: {
          sx: {
            fontFamily: "Pretendard Variable",
            color: "#ffffff",
          },
          endAdornment: withButton ? (
            <InputAdornment position="end">
              <SmallButton
                label="중복 확인"
                isDisabled={!value}
                onClick={onClickButton}
              />
            </InputAdornment>
          ) : type === "password" ? (
            <button
              type="button"
              className="cursor-pointer"
              tabIndex={0}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={handleTogglePassword}
            >
              {showPassword ? (
                <VisibilityOffIcon className="text-gray-40" />
              ) : (
                <VisibilityIcon className="text-gray-40" />
              )}
            </button>
          ) : undefined,
        },

        inputLabel: {
          sx: {
            fontFamily: "Pretendard Variable",
            color: "#676767", // 기본 상태 레이블 색상

            "&.Mui-focused": {
              color: "#bafd4f", // 포커스 상태에서 색상 변경
            },
          },
        },
        formHelperText: {
          sx: {
            fontFamily: "Pretendard Variable",
            color: "#bafd4f",

            "&.Mui-error": {
              color: "#ff3b38", // 에러 상태에서 색상 변경
            },
          },
        },
      }}
    />
  );
};
